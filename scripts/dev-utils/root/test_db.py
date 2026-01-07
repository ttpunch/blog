"""
Create blog_platform database and test connection
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connect to default 'postgres' database to create new database
try:
    print("Connecting to PostgreSQL (postgres db)...")
    conn = psycopg2.connect(
        host="192.168.29.165",
        port=5432,
        user="postgres",
        password="12345",
        database="postgres"
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'blog_platform'")
    exists = cursor.fetchone()
    
    if not exists:
        print("Creating database 'blog_platform'...")
        cursor.execute("CREATE DATABASE blog_platform")
        print("✅ Database 'blog_platform' created successfully!")
    else:
        print("✅ Database 'blog_platform' already exists!")
    
    cursor.close()
    conn.close()
    
    # Now test connection to blog_platform
    print("\nTesting connection to blog_platform...")
    conn2 = psycopg2.connect(
        host="192.168.29.165",
        port=5432,
        user="postgres",
        password="12345",
        database="blog_platform"
    )
    cursor2 = conn2.cursor()
    cursor2.execute("SELECT version();")
    version = cursor2.fetchone()
    print(f"✅ Connected to blog_platform!")
    print(f"PostgreSQL version: {version[0]}")
    cursor2.close()
    conn2.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
