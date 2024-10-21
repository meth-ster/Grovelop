#!/usr/bin/env python3
"""
Database connectivity test for MongoDB
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

async def test_mongodb_connection():
    """Test MongoDB connection and basic operations"""
    
    # Load environment variables
    ROOT_DIR = Path("/app/backend")
    load_dotenv(ROOT_DIR / '.env')
    
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    print(f"Testing MongoDB connection to: {mongo_url}")
    print(f"Database name: {db_name}")
    
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Test connection by pinging
        await client.admin.command('ping')
        print("✅ MongoDB connection successful")
        
        # Test collection operations
        test_collection = db.test_collection
        
        # Insert a test document
        test_doc = {"test": "data", "timestamp": "2025-01-01"}
        result = await test_collection.insert_one(test_doc)
        print(f"✅ Document inserted with ID: {result.inserted_id}")
        
        # Find the document
        found_doc = await test_collection.find_one({"_id": result.inserted_id})
        if found_doc:
            print("✅ Document retrieval successful")
        else:
            print("❌ Document retrieval failed")
        
        # Clean up test document
        await test_collection.delete_one({"_id": result.inserted_id})
        print("✅ Test document cleaned up")
        
        # Check status_checks collection
        status_checks = await db.status_checks.find().to_list(10)
        print(f"✅ Found {len(status_checks)} status check records")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    result = asyncio.run(test_mongodb_connection())
    exit(0 if result else 1)