"""
SQLite Database Configuration for ChainFund
Zero-configuration database - no server needed!
"""

import sqlite3
import json
from contextlib import contextmanager
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime

# Database file path
DB_PATH = Path(__file__).parent.parent / "chainfund.db"


def get_db_path() -> str:
    """Get the database file path"""
    return str(DB_PATH)


@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
    try:
        yield conn
    finally:
        conn.close()


def dict_from_row(row) -> Optional[Dict]:
    """Convert a sqlite3.Row to a dictionary"""
    if row is None:
        return None
    return dict(row)


def init_database():
    """Initialize the database with all required tables"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                wallet_address TEXT UNIQUE NOT NULL,
                username TEXT,
                email TEXT,
                avatar TEXT,
                bio TEXT,
                location TEXT,
                skills TEXT,  -- JSON array
                rating REAL DEFAULT 0,
                reviews_count INTEGER DEFAULT 0,
                member_since TEXT,
                is_verified INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Projects/Campaigns table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT UNIQUE NOT NULL,
                title TEXT NOT NULL,
                category TEXT,
                image TEXT,
                description TEXT,
                full_description TEXT,
                raised REAL DEFAULT 0,
                goal REAL NOT NULL,
                donors INTEGER DEFAULT 0,
                upvotes INTEGER DEFAULT 0,
                downvotes INTEGER DEFAULT 0,
                verified INTEGER DEFAULT 0,
                givbacks_eligible INTEGER DEFAULT 0,
                location TEXT,
                status TEXT DEFAULT 'active',
                contract_address TEXT,
                creator_wallet TEXT,
                creator_name TEXT,
                creator_stellar_address TEXT,
                creator_verified INTEGER DEFAULT 0,
                creator_member_since TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (creator_wallet) REFERENCES users(wallet_address)
            )
        ''')
        
        # Milestones table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS milestones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                amount REAL NOT NULL,
                completed INTEGER DEFAULT 0,
                target_date TEXT,
                votes_for INTEGER DEFAULT 0,
                votes_against INTEGER DEFAULT 0,
                status TEXT DEFAULT 'pending',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        ''')
        
        # Donations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS donations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                donor_wallet TEXT,
                donor_name TEXT,
                amount REAL NOT NULL,
                anonymous INTEGER DEFAULT 0,
                transaction_hash TEXT,
                status TEXT DEFAULT 'completed',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (donor_wallet) REFERENCES users(wallet_address)
            )
        ''')
        
        # Project Updates table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS project_updates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                content TEXT,
                author TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        ''')
        
        # Gigs/Services table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS gigs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                category TEXT,
                description TEXT,
                price REAL NOT NULL,
                currency TEXT DEFAULT 'USD',
                delivery_time INTEGER,
                rating REAL DEFAULT 0,
                reviews_count INTEGER DEFAULT 0,
                freelancer_id INTEGER,
                skills TEXT,  -- JSON array
                images TEXT,  -- JSON array
                packages TEXT,  -- JSON array
                tags TEXT,  -- JSON array
                status TEXT DEFAULT 'active',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (freelancer_id) REFERENCES users(id)
            )
        ''')
        
        # Orders table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                gig_id INTEGER NOT NULL,
                buyer_wallet TEXT NOT NULL,
                seller_wallet TEXT NOT NULL,
                amount REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                progress INTEGER DEFAULT 0,
                milestones TEXT,  -- JSON array
                escrow_address TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (gig_id) REFERENCES gigs(id),
                FOREIGN KEY (buyer_wallet) REFERENCES users(wallet_address),
                FOREIGN KEY (seller_wallet) REFERENCES users(wallet_address)
            )
        ''')
        
        # Transactions/Earnings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_wallet TEXT NOT NULL,
                type TEXT NOT NULL,  -- 'earning', 'withdrawal', 'fee', 'donation'
                amount REAL NOT NULL,
                description TEXT,
                reference_id TEXT,  -- order_id, project_id, etc.
                reference_type TEXT,  -- 'order', 'project', etc.
                transaction_hash TEXT,
                status TEXT DEFAULT 'completed',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_wallet) REFERENCES users(wallet_address)
            )
        ''')
        
        # Milestone Votes table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS milestone_votes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                milestone_id INTEGER NOT NULL,
                voter_wallet TEXT NOT NULL,
                vote INTEGER NOT NULL,  -- 1 for approve, 0 for reject
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(milestone_id, voter_wallet),
                FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE,
                FOREIGN KEY (voter_wallet) REFERENCES users(wallet_address)
            )
        ''')
        
        # Reviews table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                gig_id INTEGER,
                order_id INTEGER,
                reviewer_wallet TEXT NOT NULL,
                reviewed_wallet TEXT NOT NULL,
                rating INTEGER NOT NULL,
                comment TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (gig_id) REFERENCES gigs(id),
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (reviewer_wallet) REFERENCES users(wallet_address),
                FOREIGN KEY (reviewed_wallet) REFERENCES users(wallet_address)
            )
        ''')
        
        conn.commit()
        print("✅ Database tables created successfully!")


def reset_database():
    """Drop all tables and recreate them"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        tables = [
            'milestone_votes', 'reviews', 'transactions', 'orders',
            'gigs', 'project_updates', 'donations', 'milestones',
            'projects', 'users'
        ]
        
        for table in tables:
            cursor.execute(f'DROP TABLE IF EXISTS {table}')
        
        conn.commit()
    
    init_database()
    print("✅ Database reset successfully!")


# Utility functions for JSON fields
def to_json(data) -> str:
    """Convert data to JSON string"""
    return json.dumps(data) if data else '[]'


def from_json(json_str: str) -> Any:
    """Parse JSON string to Python object"""
    try:
        return json.loads(json_str) if json_str else []
    except:
        return []


if __name__ == "__main__":
    init_database()
    print(f"Database created at: {DB_PATH}")
