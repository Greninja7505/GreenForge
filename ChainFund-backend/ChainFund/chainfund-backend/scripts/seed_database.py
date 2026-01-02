"""
Seed Database with Mock Data
This script initializes the SQLite database with all existing mock data
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import init_database, get_db_connection, to_json, DB_PATH
from datetime import datetime
import json

# ==================== MOCK DATA ====================

# Projects Data (from projects.js)
PROJECTS_DATA = [
    {
        "slug": "stellar-defi-liquidity-protocol",
        "title": "Stellar DeFi Liquidity Protocol",
        "category": "DeFi Infrastructure",
        "image": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
        "description": "Next-generation automated market maker with concentrated liquidity and minimal slippage for Stellar network.",
        "full_description": """This project is building a cutting-edge decentralized exchange protocol on Stellar that implements concentrated liquidity positions, allowing liquidity providers to earn higher fees while reducing slippage for traders.

Key features include:
• Concentrated liquidity management with custom price ranges
• Capital-efficient trading with up to 4000x capital efficiency
• Cross-chain liquidity aggregation via Stellar anchors
• MEV-resistant transaction ordering
• Gasless swaps using Stellar's fee pool mechanism

The protocol has completed security audits by Trail of Bits and CertiK, with testnet launch scheduled for Q1 2026.""",
        "raised": 125600,
        "goal": 200000,
        "donors": 487,
        "upvotes": 342,
        "downvotes": 12,
        "verified": 1,
        "givbacks_eligible": 1,
        "location": "Decentralized",
        "status": "active",
        "creator_wallet": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P",
        "creator_name": "Stellar Labs Foundation",
        "creator_stellar_address": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P",
        "creator_verified": 1,
        "creator_member_since": "2023",
        "milestones": [
            {"title": "Protocol Architecture Design", "amount": 50000, "completed": 1, "target_date": "2025-04-15"},
            {"title": "Smart Contract Development", "amount": 80000, "completed": 1, "target_date": "2025-07-20"},
            {"title": "Security Audit & Testnet", "amount": 100000, "completed": 0, "target_date": "2025-10-30"},
            {"title": "Mainnet Launch & Liquidity Mining", "amount": 150000, "completed": 0, "target_date": "2026-01-15"},
            {"title": "Multi-Chain Integration", "amount": 200000, "completed": 0, "target_date": "2026-03-30"}
        ],
        "updates": [
            {"title": "Testnet Launch Successfully Deployed", "content": "Our testnet is now live with full concentrated liquidity functionality.", "date": "2025-09-15", "author": "Core Development Team"},
            {"title": "Security Audit Completed - No Critical Issues", "content": "Trail of Bits completed comprehensive security audit.", "date": "2025-08-20", "author": "Security Team"},
            {"title": "Cross-Chain Bridge Integration Progress", "content": "Integration with Wormhole bridge progressing ahead of schedule.", "date": "2025-07-10", "author": "Bridge Team"}
        ],
        "donations": [
            {"donor_name": "DeFi Whale", "amount": 25000, "date": "2025-09-18", "anonymous": 0},
            {"donor_name": "Anonymous", "amount": 15000, "date": "2025-09-15", "anonymous": 1},
            {"donor_name": "Stellar Foundation", "amount": 50000, "date": "2025-09-10", "anonymous": 0},
            {"donor_name": "Crypto VC Fund", "amount": 20000, "date": "2025-09-05", "anonymous": 0}
        ]
    },
    {
        "slug": "decentralized-identity-system",
        "title": "Decentralized Identity System",
        "category": "Identity & Privacy",
        "image": "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
        "description": "Self-sovereign identity solution with zero-knowledge proofs for privacy-preserving authentication on Stellar.",
        "full_description": """Building a comprehensive decentralized identity (DID) framework that enables users to control their digital identity without relying on centralized authorities.

Core features:
• W3C DID standard compliance for interoperability
• Zero-knowledge proof authentication for privacy
• Verifiable credentials issued on Stellar blockchain
• Biometric data encryption with threshold cryptography""",
        "raised": 89300,
        "goal": 150000,
        "donors": 342,
        "upvotes": 289,
        "downvotes": 8,
        "verified": 1,
        "givbacks_eligible": 1,
        "location": "Global",
        "status": "active",
        "creator_wallet": "GBIDYTPHZZ7M7XYTQKXN2RQ5PCBW5ZNQNM7XY2VXFVVT2QKXM7XYBIDM",
        "creator_name": "Identity Protocol DAO",
        "creator_stellar_address": "GBIDYTPHZZ7M7XYTQKXN2RQ5PCBW5ZNQNM7XY2VXFVVT2QKXM7XYBIDM",
        "creator_verified": 1,
        "creator_member_since": "2024",
        "milestones": [
            {"title": "DID Protocol Design & W3C Compliance", "amount": 30000, "completed": 1, "target_date": "2025-05-10"},
            {"title": "Zero-Knowledge Proof Implementation", "amount": 60000, "completed": 1, "target_date": "2025-07-22"},
            {"title": "Mobile SDK Development", "amount": 90000, "completed": 0, "target_date": "2025-11-15"},
            {"title": "Enterprise Partnership Integration", "amount": 120000, "completed": 0, "target_date": "2026-01-30"}
        ],
        "updates": [
            {"title": "Mobile SDK Beta Release", "content": "iOS and Android SDKs now available for developers.", "date": "2025-09-20", "author": "Mobile Team"},
            {"title": "Partnership with Major DeFi Protocols", "content": "Signed integration agreements with three top-10 DeFi protocols.", "date": "2025-08-25", "author": "Partnership Team"}
        ],
        "donations": [
            {"donor_name": "Privacy Advocate", "amount": 10000, "date": "2025-09-19", "anonymous": 0},
            {"donor_name": "Anonymous", "amount": 25000, "date": "2025-09-12", "anonymous": 1},
            {"donor_name": "Web3 Foundation", "amount": 30000, "date": "2025-08-30", "anonymous": 0}
        ]
    },
    {
        "slug": "cross-chain-nft-marketplace",
        "title": "Cross-Chain NFT Marketplace",
        "category": "NFT & Gaming",
        "image": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
        "description": "Unified NFT marketplace supporting cross-chain trading, fractional ownership, and gasless transactions on Stellar.",
        "full_description": """Revolutionary NFT marketplace that breaks down barriers between blockchain ecosystems, allowing seamless trading of NFTs across multiple chains.

Platform capabilities:
• Cross-chain NFT bridging (Ethereum, Polygon, Solana, Stellar)
• Fractional NFT ownership with automated price discovery
• Gasless minting and trading using meta-transactions
• AI-powered NFT valuation and authenticity verification""",
        "raised": 156400,
        "goal": 250000,
        "donors": 628,
        "upvotes": 512,
        "downvotes": 23,
        "verified": 1,
        "givbacks_eligible": 1,
        "location": "Distributed",
        "status": "active",
        "creator_wallet": "GNFTLABSR9WZQPVX2HKNT3M5LXBWY7AQVNFT2LABSQPVX9WZGNFTLABS",
        "creator_name": "NFT Labs Collective",
        "creator_stellar_address": "GNFTLABSR9WZQPVX2HKNT3M5LXBWY7AQVNFT2LABSQPVX9WZGNFTLABS",
        "creator_verified": 1,
        "creator_member_since": "2023",
        "milestones": [
            {"title": "Platform Architecture & Smart Contracts", "amount": 50000, "completed": 1, "target_date": "2025-04-01"},
            {"title": "Ethereum Bridge Integration", "amount": 100000, "completed": 1, "target_date": "2025-08-15"},
            {"title": "Fractional Ownership Feature", "amount": 150000, "completed": 1, "target_date": "2025-09-10"},
            {"title": "Multi-Chain Expansion", "amount": 200000, "completed": 0, "target_date": "2025-12-20"}
        ],
        "updates": [
            {"title": "Cross-Chain Bridge Live for Ethereum NFTs", "content": "Users can now bridge their Ethereum NFTs to Stellar.", "date": "2025-09-22", "author": "Bridge Team"},
            {"title": "Fractional Ownership Feature Launched", "content": "High-value NFTs can now be fractionalized into tradable shares.", "date": "2025-09-10", "author": "DeFi Team"}
        ],
        "donations": [
            {"donor_name": "NFT Collector", "amount": 18000, "date": "2025-09-21", "anonymous": 0},
            {"donor_name": "Anonymous", "amount": 40000, "date": "2025-09-15", "anonymous": 1},
            {"donor_name": "Art DAO", "amount": 35000, "date": "2025-09-08", "anonymous": 0}
        ]
    },
    {
        "slug": "stellar-dao-governance",
        "title": "Stellar DAO Governance Platform",
        "category": "Governance",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
        "description": "Comprehensive DAO tooling for creating and managing decentralized organizations on Stellar.",
        "full_description": """Build and manage decentralized autonomous organizations with ease using our comprehensive governance platform.

Features include:
• Token-weighted voting with delegation
• Proposal creation and management
• Treasury management with multi-sig
• On-chain execution of proposals""",
        "raised": 45000,
        "goal": 100000,
        "donors": 156,
        "upvotes": 198,
        "downvotes": 5,
        "verified": 1,
        "givbacks_eligible": 1,
        "location": "Remote",
        "status": "active",
        "creator_wallet": "GDAOGOV123GOVERNANCE456ADDRESS789STELLARDAO",
        "creator_name": "DAO Builders Guild",
        "creator_stellar_address": "GDAOGOV123GOVERNANCE456ADDRESS789STELLARDAO",
        "creator_verified": 1,
        "creator_member_since": "2024",
        "milestones": [
            {"title": "Core Governance Module", "amount": 25000, "completed": 1, "target_date": "2025-06-01"},
            {"title": "Voting Mechanism Implementation", "amount": 50000, "completed": 1, "target_date": "2025-08-15"},
            {"title": "Treasury Management", "amount": 75000, "completed": 0, "target_date": "2025-11-01"},
            {"title": "Full Platform Launch", "amount": 100000, "completed": 0, "target_date": "2026-01-15"}
        ],
        "updates": [
            {"title": "Beta Launch", "content": "DAO governance platform beta is now live for testing.", "date": "2025-09-01", "author": "Core Team"}
        ],
        "donations": [
            {"donor_name": "DAO Enthusiast", "amount": 5000, "date": "2025-09-10", "anonymous": 0},
            {"donor_name": "Anonymous", "amount": 15000, "date": "2025-08-25", "anonymous": 1}
        ]
    },
    {
        "slug": "defi-lending-protocol",
        "title": "Stellar Lending Protocol",
        "category": "DeFi Infrastructure",
        "image": "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=400&fit=crop",
        "description": "Decentralized lending and borrowing protocol with dynamic interest rates on Stellar.",
        "full_description": """A comprehensive lending protocol that allows users to supply and borrow assets with competitive interest rates.

Key features:
• Algorithmic interest rate model
• Flash loans for arbitrage
• Collateral management
• Liquidation protection mechanisms""",
        "raised": 78500,
        "goal": 175000,
        "donors": 234,
        "upvotes": 276,
        "downvotes": 11,
        "verified": 1,
        "givbacks_eligible": 1,
        "location": "Decentralized",
        "status": "active",
        "creator_wallet": "GLENDINGPROTOCOL123STELLAR456DEFIADDRESS789",
        "creator_name": "Stellar DeFi Labs",
        "creator_stellar_address": "GLENDINGPROTOCOL123STELLAR456DEFIADDRESS789",
        "creator_verified": 1,
        "creator_member_since": "2023",
        "milestones": [
            {"title": "Protocol Design", "amount": 35000, "completed": 1, "target_date": "2025-05-15"},
            {"title": "Smart Contract Development", "amount": 85000, "completed": 1, "target_date": "2025-08-01"},
            {"title": "Security Audit", "amount": 125000, "completed": 0, "target_date": "2025-11-15"},
            {"title": "Mainnet Launch", "amount": 175000, "completed": 0, "target_date": "2026-02-01"}
        ],
        "updates": [
            {"title": "Smart Contracts Complete", "content": "All core lending contracts have been developed and tested.", "date": "2025-08-01", "author": "Dev Team"}
        ],
        "donations": [
            {"donor_name": "DeFi Investor", "amount": 20000, "date": "2025-09-05", "anonymous": 0},
            {"donor_name": "Anonymous", "amount": 30000, "date": "2025-08-20", "anonymous": 1}
        ]
    }
]

# Gigs Data (from gigs.js)
GIGS_DATA = [
    {
        "title": "Full-Stack Web Development",
        "category": "web-development",
        "description": "Complete web application development using React, Node.js, and MongoDB",
        "price": 1500,
        "currency": "USD",
        "delivery_time": 14,
        "rating": 4.8,
        "reviews_count": 127,
        "freelancer_name": "Alex Johnson",
        "freelancer_level": "Expert",
        "freelancer_avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        "skills": ["React", "Node.js", "MongoDB", "Express"],
        "images": ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"],
        "packages": [
            {"name": "Basic Package", "price": 500},
            {"name": "Standard Package", "price": 1000},
            {"name": "Premium Package", "price": 1500}
        ],
        "tags": ["frontend", "backend", "fullstack"],
        "status": "active"
    },
    {
        "title": "Smart Contract Development",
        "category": "blockchain",
        "description": "Develop secure smart contracts for DeFi protocols on Stellar network",
        "price": 2500,
        "currency": "USD",
        "delivery_time": 21,
        "rating": 4.9,
        "reviews_count": 89,
        "freelancer_name": "Sarah Chen",
        "freelancer_level": "Expert",
        "freelancer_avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        "skills": ["Rust", "Soroban", "Stellar", "Solidity"],
        "images": ["https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop"],
        "packages": [
            {"name": "Basic Contract", "price": 800},
            {"name": "Full Protocol", "price": 2000},
            {"name": "Complete Solution", "price": 2500}
        ],
        "tags": ["blockchain", "defi", "smart-contracts"],
        "status": "active"
    },
    {
        "title": "UI/UX Design & Branding",
        "category": "design",
        "description": "Modern, responsive UI/UX design with complete branding package",
        "price": 800,
        "currency": "USD",
        "delivery_time": 10,
        "rating": 4.7,
        "reviews_count": 203,
        "freelancer_name": "Marcus Rodriguez",
        "freelancer_level": "Pro",
        "freelancer_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        "skills": ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
        "images": ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop"],
        "packages": [
            {"name": "Basic Design", "price": 300},
            {"name": "Complete UI/UX", "price": 600},
            {"name": "Full Branding", "price": 800}
        ],
        "tags": ["ui-design", "ux-design", "branding"],
        "status": "active"
    },
    {
        "title": "Mobile App Development",
        "category": "mobile",
        "description": "Cross-platform mobile app development with React Native",
        "price": 3000,
        "currency": "USD",
        "delivery_time": 30,
        "rating": 4.6,
        "reviews_count": 78,
        "freelancer_name": "Emily Wang",
        "freelancer_level": "Expert",
        "freelancer_avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        "skills": ["React Native", "iOS", "Android", "Firebase"],
        "images": ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop"],
        "packages": [
            {"name": "Basic App", "price": 1000},
            {"name": "Standard App", "price": 2000},
            {"name": "Premium App", "price": 3000}
        ],
        "tags": ["mobile", "react-native", "cross-platform"],
        "status": "active"
    },
    {
        "title": "SEO & Digital Marketing",
        "category": "marketing",
        "description": "Comprehensive SEO audit and digital marketing strategy",
        "price": 600,
        "currency": "USD",
        "delivery_time": 7,
        "rating": 4.5,
        "reviews_count": 156,
        "freelancer_name": "David Kim",
        "freelancer_level": "Pro",
        "freelancer_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        "skills": ["SEO", "Google Ads", "Analytics", "Content Marketing"],
        "images": ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"],
        "packages": [
            {"name": "SEO Audit", "price": 200},
            {"name": "Full SEO Package", "price": 400},
            {"name": "Complete Marketing", "price": 600}
        ],
        "tags": ["seo", "marketing", "analytics"],
        "status": "active"
    },
    {
        "title": "Technical Writing & Documentation",
        "category": "writing",
        "description": "Professional technical documentation for software projects",
        "price": 400,
        "currency": "USD",
        "delivery_time": 5,
        "rating": 4.8,
        "reviews_count": 92,
        "freelancer_name": "Lisa Thompson",
        "freelancer_level": "Expert",
        "freelancer_avatar": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
        "skills": ["Technical Writing", "API Documentation", "User Guides", "Markdown"],
        "images": ["https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop"],
        "packages": [
            {"name": "Basic Docs", "price": 150},
            {"name": "Complete Documentation", "price": 300},
            {"name": "Full Package", "price": 400}
        ],
        "tags": ["writing", "documentation", "technical"],
        "status": "active"
    }
]

# Users Data (from freelancer.js and generated)
USERS_DATA = [
    {
        "wallet_address": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P",
        "username": "Alex Johnson",
        "email": "alex@example.com",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
        "bio": "Passionate full-stack developer with 5+ years of experience creating beautiful, functional web applications.",
        "location": "San Francisco, CA",
        "skills": ["React", "Node.js", "TypeScript", "Python", "MongoDB", "AWS"],
        "rating": 4.8,
        "reviews_count": 127,
        "member_since": "2022-03-15",
        "is_verified": 1
    },
    {
        "wallet_address": "GBIDYTPHZZ7M7XYTQKXN2RQ5PCBW5ZNQNM7XY2VXFVVT2QKXM7XYBIDM",
        "username": "Sarah Chen",
        "email": "sarah@example.com",
        "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
        "bio": "Blockchain developer specializing in Stellar and Soroban smart contracts.",
        "location": "Singapore",
        "skills": ["Rust", "Soroban", "Stellar", "Solidity", "Web3"],
        "rating": 4.9,
        "reviews_count": 89,
        "member_since": "2023-01-10",
        "is_verified": 1
    },
    {
        "wallet_address": "GNFTLABSR9WZQPVX2HKNT3M5LXBWY7AQVNFT2LABSQPVX9WZGNFTLABS",
        "username": "Marcus Rodriguez",
        "email": "marcus@example.com",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        "bio": "UI/UX designer with a passion for creating beautiful and intuitive user experiences.",
        "location": "Austin, TX",
        "skills": ["Figma", "Adobe XD", "Photoshop", "Illustrator", "UI Design"],
        "rating": 4.7,
        "reviews_count": 203,
        "member_since": "2022-06-20",
        "is_verified": 1
    },
    {
        "wallet_address": "GDAOGOV123GOVERNANCE456ADDRESS789STELLARDAO",
        "username": "Emily Wang",
        "email": "emily@example.com",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
        "bio": "Mobile developer creating cross-platform applications.",
        "location": "Seattle, WA",
        "skills": ["React Native", "iOS", "Android", "Firebase"],
        "rating": 4.6,
        "reviews_count": 78,
        "member_since": "2023-03-05",
        "is_verified": 1
    },
    {
        "wallet_address": "GLENDINGPROTOCOL123STELLAR456DEFIADDRESS789",
        "username": "David Kim",
        "email": "david@example.com",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
        "bio": "Digital marketing specialist with expertise in SEO and growth hacking.",
        "location": "New York, NY",
        "skills": ["SEO", "Google Ads", "Analytics", "Content Marketing"],
        "rating": 4.5,
        "reviews_count": 156,
        "member_since": "2022-09-15",
        "is_verified": 1
    }
]

# Orders Data (from orders.js)
ORDERS_DATA = [
    {
        "gig_id": 1,
        "buyer_wallet": "GBIDYTPHZZ7M7XYTQKXN2RQ5PCBW5ZNQNM7XY2VXFVVT2QKXM7XYBIDM",
        "seller_wallet": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P",
        "amount": 150,
        "status": "in_progress",
        "progress": 75,
        "milestones": [
            {"title": "Initial concepts", "completed": True},
            {"title": "Client feedback", "completed": True},
            {"title": "Final revisions", "completed": False},
            {"title": "Delivery", "completed": False}
        ]
    },
    {
        "gig_id": 2,
        "buyer_wallet": "GNFTLABSR9WZQPVX2HKNT3M5LXBWY7AQVNFT2LABSQPVX9WZGNFTLABS",
        "seller_wallet": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P",
        "amount": 800,
        "status": "completed",
        "progress": 100,
        "milestones": [
            {"title": "Requirements gathering", "completed": True},
            {"title": "Design phase", "completed": True},
            {"title": "Development", "completed": True},
            {"title": "Testing & delivery", "completed": True}
        ]
    },
    {
        "gig_id": 3,
        "buyer_wallet": "GDAOGOV123GOVERNANCE456ADDRESS789STELLARDAO",
        "seller_wallet": "GNFTLABSR9WZQPVX2HKNT3M5LXBWY7AQVNFT2LABSQPVX9WZGNFTLABS",
        "amount": 300,
        "status": "active",
        "progress": 30,
        "milestones": [
            {"title": "Wireframing", "completed": True},
            {"title": "High-fidelity designs", "completed": False},
            {"title": "Client review", "completed": False},
            {"title": "Final delivery", "completed": False}
        ]
    }
]

# Transactions/Earnings Data (from earnings.js)
TRANSACTIONS_DATA = [
    {"user_wallet": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P", "type": "earning", "amount": 150, "description": "Logo Design Project", "status": "completed"},
    {"user_wallet": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P", "type": "earning", "amount": 800, "description": "Full Stack Web Development", "status": "completed"},
    {"user_wallet": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P", "type": "withdrawal", "amount": -500, "description": "Bank Transfer", "status": "completed"},
    {"user_wallet": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P", "type": "earning", "amount": 300, "description": "Mobile App UI/UX Design", "status": "pending"},
    {"user_wallet": "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P", "type": "fee", "amount": -25, "description": "Platform Fee", "status": "completed"},
]


def seed_users():
    """Seed users table"""
    print("📦 Seeding users...")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        for user in USERS_DATA:
            cursor.execute('''
                INSERT OR REPLACE INTO users 
                (wallet_address, username, email, avatar, bio, location, skills, rating, reviews_count, member_since, is_verified)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user['wallet_address'],
                user['username'],
                user['email'],
                user['avatar'],
                user['bio'],
                user['location'],
                to_json(user['skills']),
                user['rating'],
                user['reviews_count'],
                user['member_since'],
                user['is_verified']
            ))
        conn.commit()
    print(f"   ✅ {len(USERS_DATA)} users added")


def seed_projects():
    """Seed projects, milestones, updates, and donations"""
    print("📦 Seeding projects...")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        for project in PROJECTS_DATA:
            # Insert project
            cursor.execute('''
                INSERT OR REPLACE INTO projects 
                (slug, title, category, image, description, full_description, raised, goal, donors, 
                upvotes, downvotes, verified, givbacks_eligible, location, status,
                creator_wallet, creator_name, creator_stellar_address, creator_verified, creator_member_since)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                project['slug'],
                project['title'],
                project['category'],
                project['image'],
                project['description'],
                project['full_description'],
                project['raised'],
                project['goal'],
                project['donors'],
                project['upvotes'],
                project['downvotes'],
                project['verified'],
                project['givbacks_eligible'],
                project['location'],
                project['status'],
                project['creator_wallet'],
                project['creator_name'],
                project['creator_stellar_address'],
                project['creator_verified'],
                project['creator_member_since']
            ))
            project_id = cursor.lastrowid
            
            # Insert milestones
            for milestone in project.get('milestones', []):
                cursor.execute('''
                    INSERT INTO milestones (project_id, title, amount, completed, target_date)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    project_id,
                    milestone['title'],
                    milestone['amount'],
                    milestone['completed'],
                    milestone['target_date']
                ))
            
            # Insert updates
            for update in project.get('updates', []):
                cursor.execute('''
                    INSERT INTO project_updates (project_id, title, content, author, created_at)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    project_id,
                    update['title'],
                    update['content'],
                    update['author'],
                    update['date']
                ))
            
            # Insert donations
            for donation in project.get('donations', []):
                cursor.execute('''
                    INSERT INTO donations (project_id, donor_name, amount, anonymous, created_at)
                    VALUES (?, ?, ?, ?, ?)
                ''', (
                    project_id,
                    donation['donor_name'],
                    donation['amount'],
                    donation['anonymous'],
                    donation['date']
                ))
        
        conn.commit()
    print(f"   ✅ {len(PROJECTS_DATA)} projects added with milestones, updates, and donations")


def seed_gigs():
    """Seed gigs table"""
    print("📦 Seeding gigs...")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        for gig in GIGS_DATA:
            cursor.execute('''
                INSERT OR REPLACE INTO gigs 
                (title, category, description, price, currency, delivery_time, rating, reviews_count,
                skills, images, packages, tags, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                gig['title'],
                gig['category'],
                gig['description'],
                gig['price'],
                gig['currency'],
                gig['delivery_time'],
                gig['rating'],
                gig['reviews_count'],
                to_json(gig['skills']),
                to_json(gig['images']),
                to_json(gig['packages']),
                to_json(gig['tags']),
                gig['status']
            ))
        
        conn.commit()
    print(f"   ✅ {len(GIGS_DATA)} gigs added")


def seed_orders():
    """Seed orders table"""
    print("📦 Seeding orders...")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        for order in ORDERS_DATA:
            cursor.execute('''
                INSERT INTO orders 
                (gig_id, buyer_wallet, seller_wallet, amount, status, progress, milestones)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                order['gig_id'],
                order['buyer_wallet'],
                order['seller_wallet'],
                order['amount'],
                order['status'],
                order['progress'],
                to_json(order['milestones'])
            ))
        
        conn.commit()
    print(f"   ✅ {len(ORDERS_DATA)} orders added")


def seed_transactions():
    """Seed transactions table"""
    print("📦 Seeding transactions...")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        for txn in TRANSACTIONS_DATA:
            cursor.execute('''
                INSERT INTO transactions 
                (user_wallet, type, amount, description, status)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                txn['user_wallet'],
                txn['type'],
                txn['amount'],
                txn['description'],
                txn['status']
            ))
        
        conn.commit()
    print(f"   ✅ {len(TRANSACTIONS_DATA)} transactions added")


def seed_all():
    """Run all seed functions"""
    print("\n" + "="*50)
    print("🌱 SEEDING CHAINFUND DATABASE")
    print("="*50 + "\n")
    
    # Initialize database tables first
    print("📊 Initializing database tables...")
    init_database()
    
    # Seed all data
    seed_users()
    seed_projects()
    seed_gigs()
    seed_orders()
    seed_transactions()
    
    print("\n" + "="*50)
    print("✅ DATABASE SEEDING COMPLETE!")
    print(f"📁 Database location: {DB_PATH}")
    print("="*50 + "\n")
    
    # Print summary
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        tables = ['users', 'projects', 'milestones', 'donations', 'project_updates', 'gigs', 'orders', 'transactions']
        print("📊 Database Summary:")
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"   • {table}: {count} records")


if __name__ == "__main__":
    seed_all()
