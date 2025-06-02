# backend/app/models.py
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', name='{self.name}')>"

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    instructor = Column(String)
    duration = Column(String)  # e.g., "4 weeks"
    level = Column(String)     # e.g., "Beginner", "Intermediate", "Advanced"
    image_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    order_items = relationship("OrderItem", back_populates="course")
    cart_items = relationship("CartItem", back_populates="course")

    def __repr__(self):
        return f"<Course(id={self.id}, title='{self.title}', price={self.price})>"

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, completed, cancelled
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Order(id={self.id}, user_id={self.user_id}, total={self.total_amount}, status='{self.status}')>"

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    price = Column(Float, nullable=False)  # Price at time of purchase
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    course = relationship("Course", back_populates="order_items")

    def __repr__(self):
        return f"<OrderItem(id={self.id}, order_id={self.order_id}, course_id={self.course_id}, price={self.price})>"

class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    created_at = Column(DateTime, default=func.now())
    
    # Unique constraint to prevent duplicate cart items
    __table_args__ = (
        # UniqueConstraint('user_id', 'course_id', name='unique_user_course_cart'),
    )
    
    # Relationships
    user = relationship("User", back_populates="cart_items")
    course = relationship("Course", back_populates="cart_items")

    def __repr__(self):
        return f"<CartItem(id={self.id}, user_id={self.user_id}, course_id={self.course_id})>"

# Additional models can be added here as needed

class Category(Base):
    """Course categories for better organization (optional enhancement)"""
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}')>"

class Review(Base):
    """Course reviews (optional enhancement)"""
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    course = relationship("Course")
    user = relationship("User")

    def __repr__(self):
        return f"<Review(id={self.id}, course_id={self.course_id}, user_id={self.user_id}, rating={self.rating})>"

# Model registry for easy access
MODEL_REGISTRY = {
    "User": User,
    "Course": Course,
    "Order": Order,
    "OrderItem": OrderItem,
    "CartItem": CartItem,
    "Category": Category,
    "Review": Review,
}

def get_model(model_name: str):
    """Get model class by name"""
    return MODEL_REGISTRY.get(model_name)

def get_all_models():
    """Get all model classes"""
    return list(MODEL_REGISTRY.values())

# Export all models
__all__ = [
    "Base",
    "User", 
    "Course", 
    "Order", 
    "OrderItem", 
    "CartItem",
    "Category",
    "Review",
    "MODEL_REGISTRY",
    "get_model",
    "get_all_models"
]