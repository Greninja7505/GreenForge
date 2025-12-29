"""
ChainFund Email Notification Service
=====================================
SMTP-based email notification system for all platform events.

Features:
- Welcome emails on registration
- Login notifications
- Project creation confirmations
- Donation receipts
- Milestone updates
- Security alerts
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import Optional, List, Dict, Any
from datetime import datetime
import os
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EmailConfig:
    """Email configuration from environment variables"""
    
    # SMTP Settings
    SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    
    # Sender Settings
    SENDER_NAME = os.getenv("EMAIL_SENDER_NAME", "StellarForge ChainFund")
    SENDER_EMAIL = os.getenv("EMAIL_SENDER_EMAIL", SMTP_USER)
    
    # App Settings
    APP_NAME = "StellarForge ChainFund"
    APP_URL = os.getenv("APP_URL", "http://localhost:5173")
    SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL", "support@stellarforge.io")
    
    # Email Templates Toggle
    EMAILS_ENABLED = os.getenv("EMAILS_ENABLED", "true").lower() == "true"


class EmailTemplates:
    """HTML email templates for various notifications"""
    
    @staticmethod
    def base_template(content: str, title: str = "StellarForge Notification") -> str:
        """Base HTML template with dark theme matching the app"""
        return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0a0a0a; color: #ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 400; color: #ffffff; letter-spacing: 0.02em;">
                                ✨ StellarForge
                            </h1>
                            <p style="margin: 8px 0 0 0; font-size: 14px; color: #888888;">
                                ChainFund Platform
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 32px;">
                            {content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 32px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); background-color: rgba(0,0,0,0.3); border-radius: 0 0 16px 16px;">
                            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666666;">
                                © {datetime.now().year} StellarForge. Built on Stellar Network.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #666666;">
                                <a href="{EmailConfig.APP_URL}" style="color: #888888; text-decoration: none;">Website</a> · 
                                <a href="{EmailConfig.APP_URL}/about" style="color: #888888; text-decoration: none;">About</a> · 
                                <a href="mailto:{EmailConfig.SUPPORT_EMAIL}" style="color: #888888; text-decoration: none;">Support</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

    @staticmethod
    def welcome_email(user_name: str, user_email: str) -> tuple:
        """Welcome email for new registrations"""
        subject = f"🎉 Welcome to StellarForge, {user_name}!"
        
        content = f"""
            <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 300; color: #ffffff;">
                Welcome to the Future of Funding!
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Hi {user_name},
            </p>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                You've successfully joined StellarForge ChainFund – the decentralized crowdfunding platform 
                built on the Stellar blockchain. Here's what you can do:
            </p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 24px 0;">
                <tr>
                    <td style="padding: 16px; background-color: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 12px;">
                        <strong style="color: #ffffff;">💰 Fund Projects</strong>
                        <p style="margin: 8px 0 0 0; font-size: 14px; color: #888888;">
                            Support innovative blockchain projects with crypto donations
                        </p>
                    </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                    <td style="padding: 16px; background-color: rgba(255,255,255,0.05); border-radius: 12px;">
                        <strong style="color: #ffffff;">🚀 Create Projects</strong>
                        <p style="margin: 8px 0 0 0; font-size: 14px; color: #888888;">
                            Launch your own crowdfunding campaigns with milestone-based escrow
                        </p>
                    </td>
                </tr>
                <tr><td style="height: 12px;"></td></tr>
                <tr>
                    <td style="padding: 16px; background-color: rgba(255,255,255,0.05); border-radius: 12px;">
                        <strong style="color: #ffffff;">🗳️ Participate in Governance</strong>
                        <p style="margin: 8px 0 0 0; font-size: 14px; color: #888888;">
                            Vote on milestone approvals using quadratic voting
                        </p>
                    </td>
                </tr>
            </table>
            
            <p style="margin: 24px 0; text-align: center;">
                <a href="{EmailConfig.APP_URL}/dashboard" 
                   style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #000000; 
                          text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                    Go to Dashboard →
                </a>
            </p>
            
            <p style="margin: 24px 0 0 0; font-size: 14px; color: #666666; text-align: center;">
                Connected as: {user_email}
            </p>
        """
        
        return subject, EmailTemplates.base_template(content, subject)

    @staticmethod
    def login_notification(user_name: str, ip_address: str = "Unknown", device: str = "Unknown") -> tuple:
        """Login notification email"""
        subject = "🔐 New Login to Your StellarForge Account"
        
        login_time = datetime.now().strftime("%B %d, %Y at %I:%M %p UTC")
        
        content = f"""
            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 300; color: #ffffff;">
                New Sign-In Detected
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Hi {user_name},
            </p>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                We noticed a new sign-in to your StellarForge account. Here are the details:
            </p>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" 
                   style="background-color: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 24px 0;">
                <tr>
                    <td style="padding: 8px 16px; color: #888888;">Time:</td>
                    <td style="padding: 8px 16px; color: #ffffff; text-align: right;">{login_time}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px; color: #888888;">IP Address:</td>
                    <td style="padding: 8px 16px; color: #ffffff; text-align: right;">{ip_address}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 16px; color: #888888;">Device:</td>
                    <td style="padding: 8px 16px; color: #ffffff; text-align: right;">{device}</td>
                </tr>
            </table>
            
            <div style="padding: 16px; background-color: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); 
                        border-radius: 12px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #ffc107;">
                    ⚠️ <strong>Wasn't you?</strong> If you didn't sign in, please secure your account immediately 
                    by changing your password and contacting support.
                </p>
            </div>
            
            <p style="margin: 24px 0; text-align: center;">
                <a href="{EmailConfig.APP_URL}/profile" 
                   style="display: inline-block; padding: 12px 28px; background-color: transparent; color: #ffffff; 
                          text-decoration: none; border-radius: 12px; font-weight: 500; border: 1px solid rgba(255,255,255,0.3);">
                    Review Account Settings
                </a>
            </p>
        """
        
        return subject, EmailTemplates.base_template(content, subject)

    @staticmethod
    def project_created(user_name: str, project_title: str, project_slug: str, goal: float) -> tuple:
        """Project creation confirmation email"""
        subject = f"🚀 Your Project '{project_title}' is Live!"
        
        content = f"""
            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 300; color: #ffffff;">
                Your Project is Now Live!
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Congratulations {user_name}! 🎉
            </p>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Your project has been successfully created and is now visible to the community.
            </p>
            
            <div style="background-color: rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 500; color: #ffffff;">
                    {project_title}
                </h3>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 8px 0; color: #888888;">Funding Goal:</td>
                        <td style="padding: 8px 0; color: #49E4A4; text-align: right; font-weight: 600;">
                            ${goal:,.2f} USD
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #888888;">Status:</td>
                        <td style="padding: 8px 0; color: #49E4A4; text-align: right;">
                            ✅ Active
                        </td>
                    </tr>
                </table>
            </div>
            
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                <strong>Next Steps:</strong>
            </p>
            <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #cccccc; line-height: 1.8;">
                <li>Share your project on social media</li>
                <li>Update milestones as you make progress</li>
                <li>Engage with your backers through project updates</li>
            </ul>
            
            <p style="margin: 24px 0; text-align: center;">
                <a href="{EmailConfig.APP_URL}/project/{project_slug}" 
                   style="display: inline-block; padding: 14px 32px; background-color: #5B6FED; color: #ffffff; 
                          text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                    View Your Project →
                </a>
            </p>
        """
        
        return subject, EmailTemplates.base_template(content, subject)

    @staticmethod
    def donation_received(project_title: str, donor_name: str, amount: float, currency: str = "XLM", 
                         tx_hash: str = None) -> tuple:
        """Donation received notification for project creators"""
        subject = f"💰 New Donation: ${amount:.2f} for {project_title}"
        
        content = f"""
            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 300; color: #ffffff;">
                You've Received a Donation!
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Great news! Your project has received a new contribution.
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(73, 228, 164, 0.1), rgba(91, 111, 237, 0.1)); 
                        border-radius: 16px; padding: 32px; margin: 24px 0; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 48px; font-weight: 700; color: #49E4A4;">
                    ${amount:.2f}
                </p>
                <p style="margin: 0; font-size: 14px; color: #888888;">
                    ≈ {amount} {currency}
                </p>
            </div>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" 
                   style="background-color: rgba(255,255,255,0.05); border-radius: 12px; margin: 24px 0;">
                <tr>
                    <td style="padding: 16px; color: #888888;">Project:</td>
                    <td style="padding: 16px; color: #ffffff; text-align: right;">{project_title}</td>
                </tr>
                <tr>
                    <td style="padding: 16px; color: #888888; border-top: 1px solid rgba(255,255,255,0.1);">Donor:</td>
                    <td style="padding: 16px; color: #ffffff; text-align: right; border-top: 1px solid rgba(255,255,255,0.1);">
                        {donor_name}
                    </td>
                </tr>
                {f'''<tr>
                    <td style="padding: 16px; color: #888888; border-top: 1px solid rgba(255,255,255,0.1);">Transaction:</td>
                    <td style="padding: 16px; color: #5B6FED; text-align: right; border-top: 1px solid rgba(255,255,255,0.1);">
                        <a href="https://stellar.expert/explorer/testnet/tx/{tx_hash}" style="color: #5B6FED; text-decoration: none;">
                            {tx_hash[:12]}...
                        </a>
                    </td>
                </tr>''' if tx_hash else ''}
            </table>
            
            <p style="margin: 24px 0; text-align: center;">
                <a href="{EmailConfig.APP_URL}/dashboard" 
                   style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #000000; 
                          text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                    View Dashboard →
                </a>
            </p>
        """
        
        return subject, EmailTemplates.base_template(content, subject)

    @staticmethod
    def donation_confirmation(donor_name: str, project_title: str, amount: float, currency: str = "XLM",
                             tx_hash: str = None) -> tuple:
        """Donation confirmation email for donors"""
        subject = f"🎁 Thank You for Supporting {project_title}!"
        
        content = f"""
            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 300; color: #ffffff;">
                Thank You for Your Donation!
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Hi {donor_name},
            </p>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Your generous contribution helps bring innovative blockchain projects to life. 
                Here's your donation receipt:
            </p>
            
            <div style="background-color: rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; margin: 24px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 12px 0; color: #888888;">Project:</td>
                        <td style="padding: 12px 0; color: #ffffff; text-align: right; font-weight: 500;">
                            {project_title}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; color: #888888; border-top: 1px solid rgba(255,255,255,0.1);">Amount:</td>
                        <td style="padding: 12px 0; color: #49E4A4; text-align: right; font-weight: 600; font-size: 18px; border-top: 1px solid rgba(255,255,255,0.1);">
                            ${amount:.2f} ({currency})
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; color: #888888; border-top: 1px solid rgba(255,255,255,0.1);">Date:</td>
                        <td style="padding: 12px 0; color: #ffffff; text-align: right; border-top: 1px solid rgba(255,255,255,0.1);">
                            {datetime.now().strftime("%B %d, %Y")}
                        </td>
                    </tr>
                    {f'''<tr>
                        <td style="padding: 12px 0; color: #888888; border-top: 1px solid rgba(255,255,255,0.1);">Transaction ID:</td>
                        <td style="padding: 12px 0; color: #5B6FED; text-align: right; border-top: 1px solid rgba(255,255,255,0.1);">
                            <a href="https://stellar.expert/explorer/testnet/tx/{tx_hash}" style="color: #5B6FED; text-decoration: none;">
                                View on Explorer ↗
                            </a>
                        </td>
                    </tr>''' if tx_hash else ''}
                </table>
            </div>
            
            <p style="margin: 0 0 24px 0; font-size: 14px; color: #888888; line-height: 1.6;">
                Your funds are held in our smart contract escrow and will be released to the project 
                as milestones are completed and approved by the community.
            </p>
            
            <p style="margin: 24px 0; text-align: center;">
                <a href="{EmailConfig.APP_URL}/profile" 
                   style="display: inline-block; padding: 14px 32px; background-color: #5B6FED; color: #ffffff; 
                          text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                    View Your Donations →
                </a>
            </p>
        """
        
        return subject, EmailTemplates.base_template(content, subject)

    @staticmethod
    def milestone_completed(user_name: str, project_title: str, milestone_title: str, 
                           milestone_number: int) -> tuple:
        """Milestone completion notification"""
        subject = f"🎯 Milestone Completed: {milestone_title}"
        
        content = f"""
            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 300; color: #ffffff;">
                Milestone Achieved!
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Hi {user_name},
            </p>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Great news! A project you're supporting has completed a milestone:
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(73, 228, 164, 0.1), rgba(91, 111, 237, 0.1)); 
                        border-radius: 16px; padding: 24px; margin: 24px 0;">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                    <span style="background-color: #49E4A4; color: #000000; padding: 4px 12px; border-radius: 20px; 
                                 font-size: 12px; font-weight: 600;">
                        MILESTONE {milestone_number}
                    </span>
                </div>
                <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 500; color: #ffffff;">
                    {milestone_title}
                </h3>
                <p style="margin: 0; font-size: 14px; color: #888888;">
                    Project: {project_title}
                </p>
            </div>
            
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                You can now vote on whether to approve this milestone and release the associated funds 
                to the project creators.
            </p>
            
            <p style="margin: 24px 0; text-align: center;">
                <a href="{EmailConfig.APP_URL}/governance" 
                   style="display: inline-block; padding: 14px 32px; background-color: #ffffff; color: #000000; 
                          text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                    Vote Now →
                </a>
            </p>
        """
        
        return subject, EmailTemplates.base_template(content, subject)

    @staticmethod
    def password_reset(user_name: str, reset_token: str) -> tuple:
        """Password reset email"""
        subject = "🔑 Reset Your StellarForge Password"
        reset_link = f"{EmailConfig.APP_URL}/reset-password?token={reset_token}"
        
        content = f"""
            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 300; color: #ffffff;">
                Password Reset Request
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Hi {user_name},
            </p>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <p style="margin: 32px 0; text-align: center;">
                <a href="{reset_link}" 
                   style="display: inline-block; padding: 16px 40px; background-color: #ffffff; color: #000000; 
                          text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">
                    Reset Password
                </a>
            </p>
            
            <p style="margin: 0 0 16px 0; font-size: 14px; color: #888888; line-height: 1.6;">
                This link will expire in 1 hour for security reasons.
            </p>
            
            <div style="padding: 16px; background-color: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); 
                        border-radius: 12px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #ffc107;">
                    ⚠️ If you didn't request this password reset, please ignore this email. 
                    Your password will remain unchanged.
                </p>
            </div>
            
            <p style="margin: 24px 0 0 0; font-size: 12px; color: #666666;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <span style="color: #5B6FED; word-break: break-all;">{reset_link}</span>
            </p>
        """
        
        return subject, EmailTemplates.base_template(content, subject)

    @staticmethod
    def wallet_connected(user_name: str, wallet_address: str, chain: str = "Stellar") -> tuple:
        """Wallet connection notification"""
        subject = "🔗 New Wallet Connected to Your Account"
        
        short_address = f"{wallet_address[:8]}...{wallet_address[-8:]}" if len(wallet_address) > 16 else wallet_address
        
        content = f"""
            <h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 300; color: #ffffff;">
                Wallet Connected Successfully
            </h2>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                Hi {user_name},
            </p>
            <p style="margin: 0 0 24px 0; font-size: 16px; color: #cccccc; line-height: 1.6;">
                A new wallet has been connected to your StellarForge account:
            </p>
            
            <div style="background-color: rgba(73, 228, 164, 0.1); border: 1px solid rgba(73, 228, 164, 0.3); 
                        border-radius: 12px; padding: 20px; margin: 24px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 8px 0; color: #888888;">Chain:</td>
                        <td style="padding: 8px 0; color: #ffffff; text-align: right; font-weight: 500;">
                            {chain}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; color: #888888;">Address:</td>
                        <td style="padding: 8px 0; color: #49E4A4; text-align: right; font-family: monospace;">
                            {short_address}
                        </td>
                    </tr>
                </table>
            </div>
            
            <p style="margin: 0 0 24px 0; font-size: 14px; color: #888888; line-height: 1.6;">
                You can now use this wallet for donations, project creation, and governance voting.
            </p>
            
            <div style="padding: 16px; background-color: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); 
                        border-radius: 12px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #ffc107;">
                    ⚠️ If you didn't connect this wallet, please remove it from your account immediately 
                    and contact support.
                </p>
            </div>
        """
        
        return subject, EmailTemplates.base_template(content, subject)


class EmailService:
    """Main email service for sending notifications"""
    
    def __init__(self):
        self.config = EmailConfig
        self.templates = EmailTemplates
        self._connection = None
    
    def _get_connection(self):
        """Create SMTP connection"""
        try:
            if self.config.SMTP_USE_TLS:
                context = ssl.create_default_context()
                server = smtplib.SMTP(self.config.SMTP_HOST, self.config.SMTP_PORT)
                server.starttls(context=context)
            else:
                server = smtplib.SMTP(self.config.SMTP_HOST, self.config.SMTP_PORT)
            
            if self.config.SMTP_USER and self.config.SMTP_PASSWORD:
                server.login(self.config.SMTP_USER, self.config.SMTP_PASSWORD)
            
            return server
        except Exception as e:
            logger.error(f"Failed to connect to SMTP server: {e}")
            return None
    
    def _send_email(self, to_email: str, subject: str, html_content: str, 
                   plain_text: str = None) -> bool:
        """Send an email"""
        if not self.config.EMAILS_ENABLED:
            logger.info(f"Emails disabled. Would have sent to {to_email}: {subject}")
            return True
        
        if not self.config.SMTP_USER or not self.config.SMTP_PASSWORD:
            logger.warning("SMTP credentials not configured. Email not sent.")
            return False
        
        try:
            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.config.SENDER_NAME} <{self.config.SENDER_EMAIL}>"
            msg["To"] = to_email
            
            # Add plain text fallback
            if plain_text:
                msg.attach(MIMEText(plain_text, "plain"))
            
            # Add HTML content
            msg.attach(MIMEText(html_content, "html"))
            
            # Send
            server = self._get_connection()
            if server:
                server.sendmail(
                    self.config.SENDER_EMAIL,
                    to_email,
                    msg.as_string()
                )
                server.quit()
                logger.info(f"Email sent successfully to {to_email}: {subject}")
                return True
            else:
                logger.error("Failed to get SMTP connection")
                return False
                
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False
    
    # ========================================================================
    # PUBLIC API
    # ========================================================================
    
    def send_welcome_email(self, user_email: str, user_name: str) -> bool:
        """Send welcome email to new users"""
        subject, html = self.templates.welcome_email(user_name, user_email)
        return self._send_email(user_email, subject, html)
    
    def send_login_notification(self, user_email: str, user_name: str, 
                               ip_address: str = "Unknown", device: str = "Unknown") -> bool:
        """Send login notification"""
        subject, html = self.templates.login_notification(user_name, ip_address, device)
        return self._send_email(user_email, subject, html)
    
    def send_project_created(self, user_email: str, user_name: str, 
                            project_title: str, project_slug: str, goal: float) -> bool:
        """Send project creation confirmation"""
        subject, html = self.templates.project_created(user_name, project_title, project_slug, goal)
        return self._send_email(user_email, subject, html)
    
    def send_donation_received(self, creator_email: str, project_title: str, 
                              donor_name: str, amount: float, currency: str = "XLM",
                              tx_hash: str = None) -> bool:
        """Send donation notification to project creator"""
        subject, html = self.templates.donation_received(
            project_title, donor_name, amount, currency, tx_hash
        )
        return self._send_email(creator_email, subject, html)
    
    def send_donation_confirmation(self, donor_email: str, donor_name: str,
                                  project_title: str, amount: float, 
                                  currency: str = "XLM", tx_hash: str = None) -> bool:
        """Send donation receipt to donor"""
        subject, html = self.templates.donation_confirmation(
            donor_name, project_title, amount, currency, tx_hash
        )
        return self._send_email(donor_email, subject, html)
    
    def send_milestone_notification(self, user_email: str, user_name: str,
                                   project_title: str, milestone_title: str,
                                   milestone_number: int) -> bool:
        """Send milestone completion notification"""
        subject, html = self.templates.milestone_completed(
            user_name, project_title, milestone_title, milestone_number
        )
        return self._send_email(user_email, subject, html)
    
    def send_password_reset(self, user_email: str, user_name: str, reset_token: str) -> bool:
        """Send password reset email"""
        subject, html = self.templates.password_reset(user_name, reset_token)
        return self._send_email(user_email, subject, html)
    
    def send_wallet_connected(self, user_email: str, user_name: str,
                             wallet_address: str, chain: str = "Stellar") -> bool:
        """Send wallet connection notification"""
        subject, html = self.templates.wallet_connected(user_name, wallet_address, chain)
        return self._send_email(user_email, subject, html)


# Singleton instance
email_service = EmailService()