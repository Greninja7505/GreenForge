"""
Projects Router - Project and Campaign Management with Email Notifications

Features:
- Create projects/campaigns
- Fund projects (donations)
- Track milestones
- Email notifications for all events
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, validator
from typing import Optional, List
from datetime import datetime
import json
import asyncio
from ..database import get_db_connection, dict_from_row
from ..services.email_service import email_service

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])


# ============================================================================
# Pydantic Models
# ============================================================================

class MilestoneCreate(BaseModel):
    """Milestone creation model"""
    title: str
    description: str = ""
    amount: float
    deadline: Optional[str] = None


class ProjectCreate(BaseModel):
    """Project creation model"""
    title: str
    description: str
    full_description: str = ""
    category: str = "DeFi Infrastructure"
    goal: float
    location: str = "Decentralized"
    milestones: List[MilestoneCreate] = []
    website: Optional[str] = None
    twitter: Optional[str] = None
    discord: Optional[str] = None
    
    @validator('goal')
    def validate_goal(cls, v):
        if v < 100:
            raise ValueError('Goal must be at least $100')
        if v > 10000000:
            raise ValueError('Goal cannot exceed $10,000,000')
        return v


class DonationCreate(BaseModel):
    """Donation model"""
    project_id: int
    amount: float
    currency: str = "XLM"
    message: Optional[str] = None
    anonymous: bool = False
    tx_hash: Optional[str] = None
    
    @validator('amount')
    def validate_amount(cls, v):
        if v < 1:
            raise ValueError('Minimum donation is $1')
        return v


class MilestoneUpdate(BaseModel):
    """Milestone completion model"""
    proof_url: Optional[str] = None
    notes: str = ""


# ============================================================================
# Helper Functions
# ============================================================================

def get_user_by_id(user_id: int):
    """Get user by ID"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return dict_from_row(row)


def get_project_backers(project_id: int):
    """Get all backers of a project"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT DISTINCT u.id, u.email, u.username 
            FROM donations d
            JOIN users u ON d.donor_wallet = u.wallet_address
            WHERE d.project_id = ?
        """, (project_id,))
        return [dict_from_row(row) for row in cursor.fetchall()]


# ============================================================================
# Project Routes
# ============================================================================

@router.post("/create")
async def create_project(
    project: ProjectCreate,
    background_tasks: BackgroundTasks,
    user_id: int = None  # In production, get from JWT token
):
    """
    Create a new project/campaign with email notifications
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            now = datetime.utcnow().isoformat()
            
            # Create slug from title
            slug = project.title.lower()
            for char in [' ', '_', '.', ',', '!', '?']:
                slug = slug.replace(char, '-')
            slug = '-'.join(filter(None, slug.split('-')))
            
            # Check if slug exists
            cursor.execute("SELECT id FROM projects WHERE slug = ?", (slug,))
            if cursor.fetchone():
                slug = f"{slug}-{int(datetime.now().timestamp())}"
            
            # Insert project - Using columns that exist in database
            cursor.execute('''
                INSERT INTO projects (
                    title, slug, description, full_description,
                    category, goal, location, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                project.title,
                slug,
                project.description,
                project.full_description,
                project.category,
                project.goal,
                project.location,
                'active',
                now
            ))
            
            project_id = cursor.lastrowid
            
            # Insert milestones - Using correct column names (project_id, target_date)
            for i, milestone in enumerate(project.milestones, 1):
                cursor.execute('''
                    INSERT INTO milestones (
                        project_id, title, description, amount, 
                        target_date, status
                    ) VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    project_id,
                    milestone.title,
                    milestone.description,
                    milestone.amount,
                    milestone.deadline,
                    'pending'
                ))
            
            conn.commit()
            
            # Get creator info for email
            if user_id:
                creator = get_user_by_id(user_id)
                if creator and creator.get('email'):
                    # Send project created email
                    background_tasks.add_task(
                        email_service.send_project_created,
                        creator['email'],
                        creator.get('username', 'Project Creator'),
                        project.title,
                        slug,
                        project.goal
                    )
            
            return {
                "success": True,
                "project_id": project_id,
                "slug": slug,
                "message": f"Project '{project.title}' created successfully!"
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create project: {str(e)}"
        )


@router.post("/{project_id}/donate")
async def donate_to_project(
    project_id: int,
    donation: DonationCreate,
    background_tasks: BackgroundTasks,
    user_id: int = None  # In production, get from JWT token
):
    """
    Donate to a project with email notifications to both donor and creator
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            now = datetime.utcnow().isoformat()
            
            # Get project info
            cursor.execute("""
                SELECT * FROM projects WHERE id = ?
            """, (project_id,))
            
            project_row = cursor.fetchone()
            if not project_row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
            
            project = dict_from_row(project_row)
            
            # Get donor info
            donor = None
            donor_name = "Anonymous Donor"
            donor_email = None
            
            if user_id:
                donor = get_user_by_id(user_id)
                if donor:
                    donor_name = donor.get('username', 'Anonymous') if not donation.anonymous else 'Anonymous Donor'
                    donor_email = donor.get('email')
            
            # Record donation - Using correct column names from database schema
            cursor.execute('''
                INSERT INTO donations (
                    project_id, donor_name, amount,
                    anonymous, transaction_hash, created_at
                ) VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                project_id,
                donor_name,
                donation.amount,
                1 if donation.anonymous else 0,
                donation.tx_hash,
                now
            ))
            
            # Update project raised amount - Using 'donors' not 'backers'
            cursor.execute('''
                UPDATE projects 
                SET raised = raised + ?, donors = donors + 1
                WHERE id = ?
            ''', (donation.amount, project_id))
            
            conn.commit()
            
            # Send email to project creator
            if project.get('creator_email'):
                background_tasks.add_task(
                    email_service.send_donation_received,
                    project['creator_email'],
                    project['title'],
                    donor_name,
                    donation.amount,
                    donation.currency,
                    donation.tx_hash
                )
            
            # Send receipt to donor
            if donor_email and not donation.anonymous:
                background_tasks.add_task(
                    email_service.send_donation_confirmation,
                    donor_email,
                    donor.get('username', 'Supporter'),
                    project['title'],
                    donation.amount,
                    donation.currency,
                    donation.tx_hash
                )
            
            return {
                "success": True,
                "message": f"Thank you for your ${donation.amount} donation!",
                "project_title": project['title'],
                "tx_hash": donation.tx_hash
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Donation failed: {str(e)}"
        )


@router.post("/{project_id}/milestones/{milestone_id}/complete")
async def complete_milestone(
    project_id: int,
    milestone_id: int,
    update: MilestoneUpdate,
    background_tasks: BackgroundTasks,
    user_id: int = None
):
    """
    Mark a milestone as completed and notify all backers
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            now = datetime.utcnow().isoformat()
            
            # Get milestone and project info
            cursor.execute("""
                SELECT m.*, p.title as project_title
                FROM milestones m
                JOIN projects p ON m.project_id = p.id
                WHERE m.id = ? AND m.project_id = ?
            """, (milestone_id, project_id))
            
            milestone_row = cursor.fetchone()
            if not milestone_row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Milestone not found"
                )
            
            milestone = dict_from_row(milestone_row)
            
            # Update milestone status - using 'completed' column (1 for true)
            cursor.execute('''
                UPDATE milestones 
                SET status = 'completed', completed = 1
                WHERE id = ?
            ''', (milestone_id,))
            
            conn.commit()
            
            # Get all backers and notify them
            backers = get_project_backers(project_id)
            
            for backer in backers:
                if backer.get('email'):
                    background_tasks.add_task(
                        email_service.send_milestone_notification,
                        backer['email'],
                        backer.get('username', 'Backer'),
                        milestone['project_title'],
                        milestone['title'],
                        milestone.get('milestone_order', 1)
                    )
            
            return {
                "success": True,
                "message": f"Milestone '{milestone['title']}' marked as completed!",
                "backers_notified": len(backers)
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update milestone: {str(e)}"
        )


@router.get("/")
async def list_projects(
    category: Optional[str] = None,
    status: str = "active",
    limit: int = 20,
    offset: int = 0
):
    """List all projects with optional filtering"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            query = "SELECT * FROM projects WHERE status = ?"
            params = [status]
            
            if category:
                query += " AND category = ?"
                params.append(category)
            
            query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])
            
            cursor.execute(query, params)
            projects = [dict_from_row(row) for row in cursor.fetchall()]
            
            return {
                "success": True,
                "projects": projects,
                "count": len(projects)
            }
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch projects: {str(e)}"
        )


@router.get("/{project_id}")
async def get_project(project_id: int):
    """Get single project details"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT * FROM projects WHERE id = ?
            """, (project_id,))
            
            project_row = cursor.fetchone()
            if not project_row:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Project not found"
                )
            
            project = dict_from_row(project_row)
            
            # Get milestones - using project_id column
            cursor.execute("""
                SELECT * FROM milestones 
                WHERE project_id = ? 
                ORDER BY id
            """, (project_id,))
            
            project['milestones'] = [dict_from_row(row) for row in cursor.fetchall()]
            
            # Get recent donations - using project_id and donor_wallet
            cursor.execute("""
                SELECT d.*, u.username as donor_username
                FROM donations d
                LEFT JOIN users u ON d.donor_wallet = u.wallet_address
                WHERE d.project_id = ?
                ORDER BY d.created_at DESC
                LIMIT 10
            """, (project_id,))
            
            project['recent_donations'] = [dict_from_row(row) for row in cursor.fetchall()]
            
            return {
                "success": True,
                "project": project
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch project: {str(e)}"
        )
