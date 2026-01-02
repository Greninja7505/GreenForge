"""
Database Migration Script - Add Auth & Role Management
Preserves existing data while adding new columns and tables
"""

import sqlite3
import json
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent.parent / "chainfund.db"

def migrate_database():
    """Add new columns and tables without losing existing data"""
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    print("🔄 Starting database migration...")
    
    try:
        # 1. Add new columns to users table (if they don't exist)
        print("📝 Adding new columns to users table...")
        
        new_columns = [
            ("password_hash", "TEXT"),
            ("role", "TEXT DEFAULT 'donor'"),
            ("roles", "TEXT DEFAULT '[\"donor\"]'"),  # JSON array for multiple roles
            ("is_active", "INTEGER DEFAULT 1"),
            ("email_verified", "INTEGER DEFAULT 0"),
            ("last_login", "TEXT"),
            ("failed_login_attempts", "INTEGER DEFAULT 0"),
            ("locked_until", "TEXT"),
            ("primary_wallet", "TEXT"),  # Primary Stellar wallet
            ("connected_wallets", "TEXT DEFAULT '[]'"),  # JSON array of all connected wallets
            ("auth_method", "TEXT DEFAULT 'wallet'"),  # 'wallet', 'email', or 'both'
            ("stellar_public_key", "TEXT"),  # For Freighter wallet
        ]
        
        for column_name, column_type in new_columns:
            try:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}")
                print(f"  ✅ Added column: {column_name}")
            except sqlite3.OperationalError as e:
                if "duplicate column name" in str(e).lower():
                    print(f"  ⏭️  Column already exists: {column_name}")
                else:
                    raise
        
        # 2. Create auth_tokens table
        print("\n📝 Creating auth_tokens table...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS auth_tokens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT UNIQUE NOT NULL,
                refresh_token TEXT UNIQUE,
                expires_at TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                revoked INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        print("  ✅ auth_tokens table created")
        
        # 3. Create user_sessions table
        print("\n📝 Creating user_sessions table...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                wallet_address TEXT,
                ip_address TEXT,
                user_agent TEXT,
                last_activity TEXT DEFAULT CURRENT_TIMESTAMP,
                expires_at TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        print("  ✅ user_sessions table created")
        
        # 4. Create permissions table
        print("\n📝 Creating permissions table...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS permissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                resource_type TEXT,  -- 'project', 'gig', 'governance', etc.
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        print("  ✅ permissions table created")
        
        # 5. Create role_permissions table
        print("\n📝 Creating role_permissions table...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS role_permissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT NOT NULL,
                permission_id INTEGER NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
                UNIQUE(role, permission_id)
            )
        ''')
        print("  ✅ role_permissions table created")
        
        # 6. Create audit_log table
        print("\n📝 Creating audit_log table...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                wallet_address TEXT,
                action TEXT NOT NULL,
                resource_type TEXT,
                resource_id TEXT,
                ip_address TEXT,
                user_agent TEXT,
                details TEXT,  -- JSON
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        print("  ✅ audit_log table created")
        
        # 7. Create wallet_connections table (for tracking wallet auth)
        print("\n📝 Creating wallet_connections table...")
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS wallet_connections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                wallet_address TEXT NOT NULL,
                wallet_type TEXT DEFAULT 'freighter',  -- 'freighter', 'albedo', 'lobstr'
                is_primary INTEGER DEFAULT 0,
                verified INTEGER DEFAULT 0,
                last_used TEXT DEFAULT CURRENT_TIMESTAMP,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(wallet_address)
            )
        ''')
        print("  ✅ wallet_connections table created")
        
        # 8. Insert default permissions
        print("\n📝 Inserting default permissions...")
        default_permissions = [
            ('view_projects', 'View all projects', 'project'),
            ('create_project', 'Create new projects', 'project'),
            ('edit_own_project', 'Edit own projects', 'project'),
            ('delete_own_project', 'Delete own projects', 'project'),
            ('make_donation', 'Make donations', 'donation'),
            ('view_donations', 'View donation history', 'donation'),
            ('create_gig', 'Create freelancer gigs', 'gig'),
            ('manage_orders', 'Manage gig orders', 'gig'),
            ('vote_milestone', 'Vote on milestones', 'governance'),
            ('create_proposal', 'Create governance proposals', 'governance'),
            ('manage_users', 'Manage platform users', 'admin'),
            ('manage_platform', 'Manage platform settings', 'admin'),
            ('view_analytics', 'View platform analytics', 'admin'),
        ]
        
        for perm in default_permissions:
            try:
                cursor.execute(
                    "INSERT OR IGNORE INTO permissions (name, description, resource_type) VALUES (?, ?, ?)",
                    perm
                )
            except:
                pass
        print("  ✅ Default permissions inserted")
        
        # 9. Map permissions to roles
        print("\n📝 Mapping permissions to roles...")
        role_permission_mapping = {
            'donor': [1, 5, 6],  # view_projects, make_donation, view_donations
            'creator': [1, 2, 3, 4, 5, 6],  # + create/edit/delete project
            'freelancer': [1, 5, 6, 7, 8],  # + create_gig, manage_orders
            'governor': [1, 5, 6, 9, 10],  # + vote, create_proposal
            'admin': list(range(1, 14)),  # all permissions
        }
        
        for role, perm_ids in role_permission_mapping.items():
            for perm_id in perm_ids:
                try:
                    cursor.execute(
                        "INSERT OR IGNORE INTO role_permissions (role, permission_id) VALUES (?, ?)",
                        (role, perm_id)
                    )
                except:
                    pass
        print("  ✅ Role permissions mapped")
        
        # 10. Update existing users with default values
        print("\n📝 Updating existing users...")
        cursor.execute("""
            UPDATE users 
            SET role = 'donor',
                roles = '["donor"]',
                auth_method = 'wallet',
                is_active = 1
            WHERE role IS NULL OR role = ''
        """)
        print(f"  ✅ Updated {cursor.rowcount} existing users")
        
        # 11. Create indexes for performance
        print("\n📝 Creating indexes...")
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address)",
            "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
            "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)",
            "CREATE INDEX IF NOT EXISTS idx_auth_tokens_user ON auth_tokens(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_wallet_conn_user ON wallet_connections(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id)",
            "CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action)",
        ]
        
        for index_sql in indexes:
            cursor.execute(index_sql)
        print("  ✅ Indexes created")
        
        conn.commit()
        print("\n✅ Migration completed successfully!")
        print(f"📊 Database: {DB_PATH}")
        
        # Show summary
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM permissions")
        perm_count = cursor.fetchone()[0]
        
        print(f"\n📈 Summary:")
        print(f"  - Users: {user_count}")
        print(f"  - Permissions: {perm_count}")
        print(f"  - All existing data preserved ✅")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
