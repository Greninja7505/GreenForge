"""
Marketplace Router
Manage sustainable products and carbon cashback
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from ..database import get_db_connection, dict_from_row
from ..routers.auth import oauth2_scheme, get_current_user

router = APIRouter(prefix="/api/marketplace", tags=["Marketplace"])

# ==================== PYDANTIC MODELS ====================

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    currency: str = "USD"
    image: Optional[str] = None
    category: str
    carbon_offset: float = 0
    cashback_percentage: float = 0
    stock: int = 1

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    currency: str
    image: Optional[str]
    category: str
    carbon_offset: float
    cashback_percentage: float
    seller_wallet: Optional[str]
    stock: int
    rating: float
    reviews_count: int
    created_at: str

class OrderCreate(BaseModel):
    product_id: int
    quantity: int = 1

# ==================== ENDPOINTS ====================

@router.get("/products", response_model=List[ProductResponse])
async def get_products(category: Optional[str] = None):
    """Get all products"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        if category:
            cursor.execute("SELECT * FROM products WHERE category = ? ORDER BY created_at DESC", (category,))
        else:
            cursor.execute("SELECT * FROM products ORDER BY created_at DESC")
        
        rows = cursor.fetchall()
        return [dict_from_row(row) for row in rows]

@router.post("/products", response_model=ProductResponse)
async def create_product(product: ProductCreate, current_user: dict = Depends(get_current_user)):
    """List a new product"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO products (
                name, description, price, currency, image, category, 
                carbon_offset, cashback_percentage, seller_wallet, stock
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product.name, product.description, product.price, product.currency,
            product.image, product.category, product.carbon_offset,
            product.cashback_percentage, current_user['wallet_address'], product.stock
        ))
        conn.commit()
        product_id = cursor.lastrowid
        
        cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
        return dict_from_row(cursor.fetchone())

@router.post("/buy", response_model=dict)
async def buy_product(order: OrderCreate, current_user: dict = Depends(get_current_user)):
    """Buy a product"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check product
        cursor.execute("SELECT * FROM products WHERE id = ?", (order.product_id,))
        product = cursor.fetchone()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
            
        if product['stock'] < order.quantity:
             raise HTTPException(status_code=400, detail="Not enough stock")
        
        # Calculate total
        total_amount = product['price'] * order.quantity
        
        # Create order
        cursor.execute('''
            INSERT INTO product_orders (
                product_id, buyer_wallet, amount, quantity, status
            ) VALUES (?, ?, ?, ?, 'completed')
        ''', (order.product_id, current_user['wallet_address'], total_amount, order.quantity))
        
        # Update stock
        cursor.execute("UPDATE products SET stock = stock - ? WHERE id = ?", (order.quantity, order.product_id))
        
        conn.commit()
        
        return {
            "message": "Purchase successful",
            "cashback_earned": total_amount * (product['cashback_percentage'] / 100),
            "carbon_offset": product['carbon_offset'] * order.quantity
        }
