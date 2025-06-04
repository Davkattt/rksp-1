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
