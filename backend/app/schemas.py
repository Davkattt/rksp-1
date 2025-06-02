# backend/app/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# User schemas
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Course schemas
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    instructor: Optional[str] = None
    duration: Optional[str] = None
    level: Optional[str] = None
    image_url: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseRead(CourseBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Cart schemas
class CartItemCreate(BaseModel):
    course_id: int

class CartItemRead(BaseModel):
    id: int
    course: CourseRead
    created_at: datetime

    class Config:
        from_attributes = True

# Order schemas
class OrderItemRead(BaseModel):
    id: int
    course: CourseRead
    price: float

    class Config:
        from_attributes = True

class OrderRead(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    order_items: List[OrderItemRead]

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    pass  # Order will be created from cart items