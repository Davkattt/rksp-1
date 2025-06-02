# backend/app/health.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_db, health_check

async def health_check_endpoint(db: AsyncSession = Depends(get_db)):
    """Health check endpoint for Docker and monitoring"""
    try:
        # Check database connection
        db_status = await health_check()
        
        return {
            "status": "healthy",
            "database": db_status["status"],
            "message": "Course Store API is running"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "error",
            "message": f"Health check failed: {str(e)}"
        }