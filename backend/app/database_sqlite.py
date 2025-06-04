# backend/app/database_sqlite.py - SQLite configuration for local development
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv('.env.local')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration for SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./course_store.db")

# Create async engine for SQLite
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
    future=True,
    connect_args={"check_same_thread": False}  # Required for SQLite
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=True,
    autocommit=False
)

# Create declarative base
Base = declarative_base()

# Dependency for getting database session
async def get_db() -> AsyncSession:
    """Dependency that provides a database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session error: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()

# Database utility functions
async def create_all_tables():
    """Create all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        logger.info("All database tables created successfully")

async def health_check():
    """Perform a health check on the database."""
    try:
        async with AsyncSessionLocal() as session:
            # Simple query to check connection
            result = await session.execute("SELECT 1 as health_check")
            health_result = result.fetchone()
            
            if health_result and health_result[0] == 1:
                return {
                    "status": "healthy",
                    "message": "Database connection is working"
                }
            else:
                return {
                    "status": "unhealthy",
                    "message": "Database query returned unexpected result"
                }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {
            "status": "unhealthy",
            "message": f"Database connection failed: {str(e)}"
        }

# Cleanup function
async def close_database_connections():
    """Close all database connections."""
    await engine.dispose()
    logger.info("Database connections closed")
