#!/bin/bash
# setup-local.sh - Local setup without Docker for Course Store

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

echo "🚀 Course Store Local Setup (No Docker)"
echo "========================================"
echo ""

# Check if we're on Windows (Git Bash/MINGW)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "mingw"* ]]; then
    IS_WINDOWS=true
    print_status "Detected Windows environment"
else
    IS_WINDOWS=false
    print_status "Detected Unix-like environment"
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required dependencies
check_dependencies() {
    print_header "🔍 Checking Dependencies"
    
    local missing_deps=()
    
    # Check Python
    if command_exists python3; then
        PYTHON_CMD="python3"
        print_status "Python 3 found ✓"
    elif command_exists python; then
        PYTHON_VERSION=$(python --version 2>&1 | grep -o "Python [0-9]\." | grep -o "[0-9]")
        if [ "$PYTHON_VERSION" = "3" ]; then
            PYTHON_CMD="python"
            print_status "Python 3 found ✓"
        else
            missing_deps+=("Python 3")
        fi
    else
        missing_deps+=("Python 3")
    fi
    
    # Check pip
    if command_exists pip3; then
        PIP_CMD="pip3"
    elif command_exists pip; then
        PIP_CMD="pip"
    else
        missing_deps+=("pip")
    fi
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 16 ]; then
            print_status "Node.js $NODE_VERSION found ✓"
        else
            missing_deps+=("Node.js 16+")
        fi
    else
        missing_deps+=("Node.js")
    fi
    
    # Check npm
    if command_exists npm; then
        print_status "npm found ✓"
    else
        missing_deps+=("npm")
    fi
    
    # Check SQLite (built into Python, but let's verify)
    if $PYTHON_CMD -c "import sqlite3" 2>/dev/null; then
        print_status "SQLite support found ✓"
    else
        missing_deps+=("SQLite")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "Please install the missing dependencies and run this script again."
        echo ""
        echo "Installation guides:"
        echo "- Python 3: https://www.python.org/downloads/"
        echo "- Node.js: https://nodejs.org/en/download/"
        exit 1
    fi
    
    print_status "All dependencies found! ✓"
    echo ""
}

# Create SQLite database configuration
setup_sqlite_config() {
    print_header "🗄️  Setting up SQLite Database"
    
    # Create local environment file for SQLite
    cat > backend/.env.local << 'EOF'
# Local development with SQLite
DATABASE_URL=sqlite+aiosqlite:///./course_store.db
SECRET_KEY=course-store-local-secret-key-development-only
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ENVIRONMENT=development
EOF
    
    print_status "SQLite configuration created ✓"
    echo ""
}

# Create SQLite database adapter
create_sqlite_adapter() {
    print_header "🔧 Creating SQLite Database Adapter"
    
    # Create a simplified database.py for SQLite
    cat > backend/app/database_sqlite.py << 'EOF'
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
EOF
    
    print_status "SQLite adapter created ✓"
    echo ""
}

# Setup backend
setup_backend() {
    print_header "🐍 Setting up Backend"
    
    cd backend
    
    # Create virtual environment
    print_status "Creating virtual environment..."
    if [ "$IS_WINDOWS" = true ]; then
        $PYTHON_CMD -m venv venv
        source venv/Scripts/activate
    else
        $PYTHON_CMD -m venv venv
        source venv/bin/activate
    fi
    
    # Upgrade pip
    print_status "Upgrading pip..."
    $PIP_CMD install --upgrade pip
    
    # Create simplified requirements for local development
    print_status "Creating simplified requirements..."
    cat > requirements-local.txt << 'EOF'
# Simplified requirements for local development with SQLite
fastapi==0.115.12
uvicorn[standard]==0.34.3
pydantic==2.11.5
pydantic[email]==2.11.5

# Database - SQLite instead of PostgreSQL
sqlalchemy==2.0.41
aiosqlite==0.20.0

# Authentication
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
python-multipart==0.0.6

# Environment and utilities
python-dotenv==1.1.0
python-dateutil==2.8.2

# Additional utilities
email-validator==2.1.0
EOF
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    $PIP_CMD install -r requirements-local.txt
    
    print_status "Backend setup completed ✓"
    cd ..
    echo ""
}

# Setup frontend
setup_frontend() {
    print_header "⚛️ Setting up Frontend"
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Create local environment file for frontend
    cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:8000
EOF
    
    print_status "Frontend setup completed ✓"
    cd ..
    echo ""
}

# Create modified main.py for SQLite
create_main_sqlite() {
    print_header "🔧 Configuring Backend for SQLite"
    
    # Backup original main.py
    cp backend/app/main.py backend/app/main.py.postgres.backup
    
    # Create new main.py that uses SQLite
    cat > backend/app/main.py << 'EOF'
# backend/app/main.py - Modified for SQLite local development
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

# Import SQLite database configuration
from .database_sqlite import get_db, create_all_tables, health_check
from . import crud, schemas, auth

# Create FastAPI app
app = FastAPI(
    title="Course Store API (Local SQLite)",
    description="API для интернет-магазина курсов - Local Development",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    await create_all_tables()

# Helper function to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    token = credentials.credentials
    payload = auth.decode_access_token(token)
    if not payload or 'sub' not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    email = payload['sub']
    user = await crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

# Root endpoint
@app.get("/", tags=["root"])
async def read_root():
    return {
        "message": "Course Store API is running! (Local SQLite)",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "OK",
        "database": "SQLite"
    }

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check_route():
    db_health = await health_check()
    return {
        "status": "healthy",
        "message": "API is working",
        "database": db_health
    }

# Auth routes
@app.post("/api/register", response_model=schemas.UserRead, tags=["auth"])
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await crud.create_user(db, user)

@app.post("/api/login", tags=["auth"])
async def login(user: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await crud.get_user_by_email(db, user.email)
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    token = auth.create_access_token({"sub": db_user.email})
    return {
        "access_token": token, 
        "token_type": "bearer", 
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }

@app.get("/api/me", response_model=schemas.UserRead, tags=["auth"])
async def get_me(current_user: schemas.UserRead = Depends(get_current_user)):
    return current_user

# Course routes
@app.get("/api/courses", response_model=List[schemas.CourseRead], tags=["courses"])
async def get_courses(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.get_courses(db, skip=skip, limit=limit)

@app.get("/api/courses/{course_id}", response_model=schemas.CourseRead, tags=["courses"])
async def get_course(course_id: int, db: AsyncSession = Depends(get_db)):
    course = await crud.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

# Cart routes
@app.get("/api/cart", response_model=List[schemas.CartItemRead], tags=["cart"])
async def get_cart(
    current_user: schemas.UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await crud.get_user_cart(db, current_user.id)

@app.post("/api/cart", tags=["cart"])
async def add_to_cart(
    cart_item: schemas.CartItemCreate,
    current_user: schemas.UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        await crud.add_to_cart(db, current_user.id, cart_item.course_id)
        return {"message": "Course added to cart"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/cart/{cart_item_id}", tags=["cart"])
async def remove_from_cart(
    cart_item_id: int,
    current_user: schemas.UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    success = await crud.remove_from_cart(db, current_user.id, cart_item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Course removed from cart"}

# Order routes
@app.post("/api/orders", response_model=schemas.OrderRead, tags=["orders"])
async def create_order(
    current_user: schemas.UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        return await crud.create_order_from_cart(db, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/orders", response_model=List[schemas.OrderRead], tags=["orders"])
async def get_orders(
    current_user: schemas.UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await crud.get_user_orders(db, current_user.id)
EOF
    
    print_status "Backend configured for SQLite ✓"
    echo ""
}

# Create database initialization script for SQLite
create_init_script() {
    print_header "📊 Creating Database Initialization"
    
    cat > backend/init_db_local.py << 'EOF'
# backend/init_db_local.py - Initialize SQLite database with sample data
import asyncio
from app.database_sqlite import create_all_tables, AsyncSessionLocal
from app.models import Course, User
from app.auth import get_password_hash
import os
from dotenv import load_dotenv

# Load local environment
load_dotenv('.env.local')

async def init_database():
    """Initialize database with tables and sample data"""
    print("🔄 Initializing SQLite database...")
    
    try:
        # Create all tables
        await create_all_tables()
        print("✅ Database tables created successfully")
        
        # Add sample data
        async with AsyncSessionLocal() as session:
            try:
                # Check if courses already exist
                from sqlalchemy import select
                existing_courses = await session.execute(select(Course))
                if existing_courses.scalars().first():
                    print("📚 Courses already exist, skipping course creation")
                else:
                    # Add sample courses
                    courses = [
                        Course(
                            title="Курс по веб-разработке",
                            description="Научитесь создавать современные сайты с нуля! Изучите HTML, CSS, JavaScript и современные фреймворки. Курс включает практические проекты и реальные кейсы.",
                            price=5000.0,
                            instructor="Иван Иванов",
                            duration="8 недель",
                            level="Начинающий",
                            image_url="/images/web-dev.jpg"
                        ),
                        Course(
                            title="Курс по дизайну",
                            description="Освойте основы графического дизайна и UX/UI. Научитесь работать в Figma, Adobe Creative Suite и создавать эффективные пользовательские интерфейсы.",
                            price=4500.0,
                            instructor="Мария Петрова",
                            duration="6 недель",
                            level="Начинающий",
                            image_url="/images/design.jpg"
                        ),
                        Course(
                            title="Курс по программированию на Python",
                            description="Станьте профессиональным разработчиком на Python! От основ до продвинутых техник. Изучите Django, Flask, работу с базами данных и API.",
                            price=6000.0,
                            instructor="Алексей Сидоров",
                            duration="12 недель",
                            level="Средний",
                            image_url="/images/python.jpg"
                        ),
                        Course(
                            title="Курс по Data Science",
                            description="Изучите анализ данных, машинное обучение и работу с большими данными. Освойте Python, SQL, pandas, scikit-learn и другие инструменты.",
                            price=8000.0,
                            instructor="Елена Козлова",
                            duration="16 недель",
                            level="Продвинутый",
                            image_url="/images/data-science.jpg"
                        )
                    ]
                    
                    for course in courses:
                        session.add(course)
                    
                    print(f"📚 Created {len(courses)} sample courses")
                
                # Check if users already exist
                existing_users = await session.execute(select(User))
                if existing_users.scalars().first():
                    print("👥 Users already exist, skipping user creation")
                else:
                    # Add sample users
                    admin_user = User(
                        name="Администратор",
                        email="admin@coursestore.ru",
                        hashed_password=get_password_hash("admin123")
                    )
                    session.add(admin_user)
                    
                    test_user = User(
                        name="Тестовый пользователь",
                        email="test@example.com",
                        hashed_password=get_password_hash("test123")
                    )
                    session.add(test_user)
                    
                    print("👥 Created sample users")
                
                await session.commit()
                print("✅ Sample data added successfully")
                
            except Exception as e:
                await session.rollback()
                print(f"❌ Error adding sample data: {e}")
                raise
        
        print("\n🎉 SQLite database initialized successfully!")
        print("\n📋 Sample accounts:")
        print("  👤 Admin: admin@coursestore.ru / admin123")
        print("  👤 Test User: test@example.com / test123")
        print(f"\n📚 Courses available: 4")
        print("\n🚀 You can now start the application!")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(init_database())
EOF
    
    print_status "Database initialization script created ✓"
    echo ""
}

# Initialize database with sample data
init_database() {
    print_header "📊 Initializing Database with Sample Data"
    
    cd backend
    
    # Activate virtual environment
    if [ "$IS_WINDOWS" = true ]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    
    # Run initialization script
    print_status "Running database initialization..."
    $PYTHON_CMD init_db_local.py
    
    cd ..
    echo ""
}

# Create start scripts
create_start_scripts() {
    print_header "📝 Creating Start Scripts"
    
    # Backend start script
    if [ "$IS_WINDOWS" = true ]; then
        cat > start-backend.bat << 'EOF'
@echo off
echo Starting Course Store Backend (SQLite)...
cd backend
call venv\Scripts\activate
set PYTHONPATH=%CD%
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
EOF
        chmod +x start-backend.bat
        
        # Frontend start script
        cat > start-frontend.bat << 'EOF'
@echo off
echo Starting Course Store Frontend...
cd frontend
npm run dev
EOF
        chmod +x start-frontend.bat
        
        # Combined start script
        cat > start-all.bat << 'EOF'
@echo off
echo Starting Course Store (Frontend + Backend)...
start "Backend" cmd /k "start-backend.bat"
timeout /t 3 /nobreak > nul
start "Frontend" cmd /k "start-frontend.bat"
echo.
echo Course Store is starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
pause
EOF
        chmod +x start-all.bat
        
    else
        # Unix start scripts
        cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "Starting Course Store Backend (SQLite)..."
cd backend
source venv/bin/activate
export PYTHONPATH=$(pwd)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
EOF
        chmod +x start-backend.sh
        
        cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "Starting Course Store Frontend..."
cd frontend
npm run dev
EOF
        chmod +x start-frontend.sh
        
        cat > start-all.sh << 'EOF'
#!/bin/bash
echo "Starting Course Store (Frontend + Backend)..."
gnome-terminal -- bash -c "./start-backend.sh; exec bash" 2>/dev/null || \
xterm -e "./start-backend.sh" 2>/dev/null || \
./start-backend.sh &
sleep 3
gnome-terminal -- bash -c "./start-frontend.sh; exec bash" 2>/dev/null || \
xterm -e "./start-frontend.sh" 2>/dev/null || \
./start-frontend.sh &
echo ""
echo "Course Store is starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"
echo ""
EOF
        chmod +x start-all.sh
    fi
    
    print_status "Start scripts created ✓"
    echo ""
}

# Main setup function
main_setup() {
    check_dependencies
    setup_sqlite_config
    create_sqlite_adapter
    setup_backend
    setup_frontend
    create_main_sqlite
    create_init_script
    init_database
    create_start_scripts
    
    print_header "🎉 Local Setup Complete!"
    echo ""
    print_status "✅ Database: SQLite (course_store.db)"
    print_status "✅ Backend: Python/FastAPI"
    print_status "✅ Frontend: React/Vite"
    print_status "✅ Sample data: Loaded"
    echo ""
    
    print_header "🚀 How to Start:"
    if [ "$IS_WINDOWS" = true ]; then
        echo "  Double-click: start-all.bat"
        echo "  Or manually:"
        echo "    Backend:  start-backend.bat"
        echo "    Frontend: start-frontend.bat"
    else
        echo "  Run: ./start-all.sh"
        echo "  Or manually:"
        echo "    Backend:  ./start-backend.sh"
        echo "    Frontend: ./start-frontend.sh"
    fi
    echo ""
    
    print_header "🔗 Access URLs:"
    echo "  Frontend:  http://localhost:5173"
    echo "  Backend:   http://localhost:8000"
    echo "  API Docs:  http://localhost:8000/docs"
    echo ""
    
    print_header "🔐 Test Accounts:"
    echo "  Admin:     admin@coursestore.ru / admin123"
    echo "  User:      test@example.com / test123"
    echo ""
    
    print_warning "Note: This setup uses SQLite instead of PostgreSQL for simplicity."
    print_warning "The database file 'course_store.db' will be created in the backend folder."
}

# Handle script arguments
case "${1:-}" in
    "check")
        check_dependencies
        ;;
    "backend")
        setup_backend
        ;;
    "frontend")
        setup_frontend
        ;;
    "init")
        init_database
        ;;
    *)
        main_setup
        ;;
esac