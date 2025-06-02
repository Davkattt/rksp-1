# backend/app/main_simple.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from .database import get_db
from . import crud, schemas, auth

# Simple FastAPI app without complex startup
app = FastAPI(
    title="Course Store API",
    description="API для интернет-магазина курсов",
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
        "message": "Course Store API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "OK"
    }

# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "message": "API is working"}

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


# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check_route(db: AsyncSession = Depends(get_db)):
    from .health import health_check_endpoint
    return await health_check_endpoint(db)