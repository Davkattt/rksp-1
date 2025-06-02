# backend/app/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://postgres:postgres@localhost:5432/course_store"
)

# Validate database URL
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    poolclass=NullPool,  # Disable connection pooling for simplicity
    future=True,
    connect_args={
        "server_settings": {
            "application_name": "course_store_app",
        }
    }
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
    """
    Dependency that provides a database session.
    Yields an async session and ensures it's properly closed.
    """
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

async def drop_all_tables():
    """Drop all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        logger.info("All database tables dropped successfully")

async def check_database_connection():
    """Check if database connection is working."""
    try:
        async with engine.begin() as conn:
            result = await conn.execute("SELECT 1")
            logger.info("Database connection successful")
            return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False

async def get_database_info():
    """Get database information."""
    try:
        async with engine.begin() as conn:
            # Get PostgreSQL version
            result = await conn.execute("SELECT version()")
            version = result.fetchone()[0]
            
            # Get current database name
            result = await conn.execute("SELECT current_database()")
            db_name = result.fetchone()[0]
            
            # Get current user
            result = await conn.execute("SELECT current_user")
            user = result.fetchone()[0]
            
            info = {
                "version": version,
                "database": db_name,
                "user": user,
                "url": DATABASE_URL.split("@")[1] if "@" in DATABASE_URL else "localhost"
            }
            
            logger.info(f"Database info: {info}")
            return info
    except Exception as e:
        logger.error(f"Failed to get database info: {e}")
        return None

# Context manager for database transactions
class DatabaseTransaction:
    """Context manager for database transactions."""
    
    def __init__(self):
        self.session = None
    
    async def __aenter__(self):
        self.session = AsyncSessionLocal()
        return self.session
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            await self.session.rollback()
            logger.error(f"Transaction rolled back due to error: {exc_val}")
        else:
            await self.session.commit()
        await self.session.close()

# Database health check
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
                    "message": "Database connection is working",
                    "timestamp": None  # Can add timestamp if needed
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

# Export commonly used items
__all__ = [
    "engine",
    "AsyncSessionLocal", 
    "Base",
    "get_db",
    "create_all_tables",
    "drop_all_tables",
    "check_database_connection",
    "get_database_info",
    "DatabaseTransaction",
    "health_check",
    "close_database_connections"
]