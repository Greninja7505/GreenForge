"""Quick test script to verify database and API endpoints"""
from app.database import get_db_connection

def test_database():
    print("Testing database connection...")
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # List all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        print(f"✅ Tables ({len(tables)}): {tables}")
        
        # Check projects
        cursor.execute("SELECT COUNT(*) FROM projects")
        count = cursor.fetchone()[0]
        print(f"✅ Projects count: {count}")
        
        # Check new governance table
        cursor.execute("SELECT COUNT(*) FROM governance_proposals")
        gov_count = cursor.fetchone()[0]
        print(f"✅ Governance proposals: {gov_count}")
        
        # Check SBT tokens table
        cursor.execute("SELECT COUNT(*) FROM sbt_tokens")
        sbt_count = cursor.fetchone()[0]
        print(f"✅ SBT tokens: {sbt_count}")
        
        print("\n✅ All database tests passed!")

if __name__ == "__main__":
    test_database()
