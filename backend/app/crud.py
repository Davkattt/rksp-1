# backend/app/crud.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from .models import User, Course, CartItem, Order, OrderItem
from .schemas import UserCreate, CourseCreate, CartItemCreate
from .auth import get_password_hash
from typing import List, Optional

# User CRUD
async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalars().first()

async def create_user(db: AsyncSession, user_create: UserCreate) -> User:
    hashed_password = get_password_hash(user_create.password)
    db_user = User(
        name=user_create.name, 
        email=user_create.email, 
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

# Course CRUD
async def get_courses(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Course]:
    result = await db.execute(
        select(Course).where(Course.is_active == True).offset(skip).limit(limit)
    )
    return result.scalars().all()

async def get_course_by_id(db: AsyncSession, course_id: int) -> Optional[Course]:
    result = await db.execute(select(Course).where(Course.id == course_id))
    return result.scalars().first()

async def create_course(db: AsyncSession, course_create: CourseCreate) -> Course:
    db_course = Course(**course_create.dict())
    db.add(db_course)
    await db.commit()
    await db.refresh(db_course)
    return db_course

# Cart CRUD
async def get_user_cart(db: AsyncSession, user_id: int) -> List[CartItem]:
    result = await db.execute(
        select(CartItem)
        .options(selectinload(CartItem.course))
        .where(CartItem.user_id == user_id)
    )
    return result.scalars().all()

async def add_to_cart(db: AsyncSession, user_id: int, course_id: int) -> CartItem:
    # Check if already in cart
    existing = await db.execute(
        select(CartItem).where(
            CartItem.user_id == user_id, 
            CartItem.course_id == course_id
        )
    )
    if existing.scalars().first():
        raise ValueError("Course already in cart")
    
    cart_item = CartItem(user_id=user_id, course_id=course_id)
    db.add(cart_item)
    await db.commit()
    await db.refresh(cart_item)
    return cart_item

async def remove_from_cart(db: AsyncSession, user_id: int, cart_item_id: int) -> bool:
    result = await db.execute(
        select(CartItem).where(
            CartItem.id == cart_item_id,
            CartItem.user_id == user_id
        )
    )
    cart_item = result.scalars().first()
    if cart_item:
        await db.delete(cart_item)
        await db.commit()
        return True
    return False

async def clear_cart(db: AsyncSession, user_id: int):
    await db.execute(
        CartItem.__table__.delete().where(CartItem.user_id == user_id)
    )
    await db.commit()

# Order CRUD
async def create_order_from_cart(db: AsyncSession, user_id: int) -> Order:
    # Get cart items
    cart_items = await get_user_cart(db, user_id)
    if not cart_items:
        raise ValueError("Cart is empty")
    
    # Calculate total
    total_amount = sum(item.course.price for item in cart_items)
    
    # Create order
    order = Order(user_id=user_id, total_amount=total_amount)
    await db.add(order)
    await db.flush()  # Get order ID
    
    # Create order items
    for cart_item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            course_id=cart_item.course_id,
            price=cart_item.course.price
        )
        await db.add(order_item)
    
    # Clear cart
    await clear_cart(db, user_id)
    
    await db.commit()
    await db.refresh(order)
    return order

async def get_user_orders(db: AsyncSession, user_id: int) -> List[Order]:
    result = await db.execute(
        select(Order)
        .options(
            selectinload(Order.order_items).selectinload(OrderItem.course)
        )
        .where(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
    )
    return result.scalars().all()