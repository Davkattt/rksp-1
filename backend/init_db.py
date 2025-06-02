# backend/init_db.py
"""
Database initialization script
Run this to create tables and add sample data
"""
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.models import Base, Course, User
from app.auth import get_password_hash
from app.database import AsyncSessionLocal, engine, create_all_tables
import os
from dotenv import load_dotenv

load_dotenv()

async def init_database():
    """Initialize database with tables and sample data"""
    print("🔄 Initializing database...")
    
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
                        ),
                        Course(
                            title="Курс по мобильной разработке",
                            description="Создавайте мобильные приложения для iOS и Android с React Native. Изучите современные подходы к разработке кроссплатформенных приложений.",
                            price=7000.0,
                            instructor="Дмитрий Волков",
                            duration="10 недель",
                            level="Средний",
                            image_url="/images/mobile.jpg"
                        ),
                        Course(
                            title="Курс по цифровому маркетингу",
                            description="Освойте современный интернет-маркетинг: SMM, контекстную рекламу, email-маркетинг и аналитику. Научитесь создавать эффективные рекламные кампании.",
                            price=4000.0,
                            instructor="Анна Кузнецова",
                            duration="8 недель",
                            level="Начинающий",
                            image_url="/images/marketing.jpg"
                        ),
                        Course(
                            title="Курс по DevOps",
                            description="Изучите современные практики DevOps: Docker, Kubernetes, CI/CD, мониторинг и автоматизацию. Научитесь настраивать инфраструктуру и деплой приложений.",
                            price=9000.0,
                            instructor="Сергей Морозов",
                            duration="14 недель",
                            level="Продвинутый",
                            image_url="/images/devops.jpg"
                        ),
                        Course(
                            title="Курс по кибербезопасности",
                            description="Освойте основы информационной безопасности: защита от угроз, этичный хакинг, анализ уязвимостей и реагирование на инциденты.",
                            price=7500.0,
                            instructor="Игорь Белов",
                            duration="12 недель",
                            level="Средний",
                            image_url="/images/security.jpg"
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
        
        print("\n🎉 Database initialized successfully!")
        print("\n📋 Sample accounts:")
        print("  👤 Admin: admin@coursestore.ru / admin123")
        print("  👤 Test User: test@example.com / test123")
        print(f"\n📚 Courses available: 8")
        print("\n🚀 You can now start the application!")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise
    finally:
        await engine.dispose()

async def reset_database():
    """Reset database by dropping and recreating all tables"""
    print("🔄 Resetting database...")
    
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            print("🗑️ Dropped all tables")
            
            await conn.run_sync(Base.metadata.create_all)
            print("🔨 Created all tables")
        
        print("✅ Database reset completed")
        
    except Exception as e:
        print(f"❌ Database reset failed: {e}")
        raise
    finally:
        await engine.dispose()

async def check_database():
    """Check database connection and show info"""
    print("🔍 Checking database connection...")
    
    try:
        async with AsyncSessionLocal() as session:
            from sqlalchemy import text, select
            
            # Test connection
            result = await session.execute(text("SELECT 1"))
            if result.scalar() == 1:
                print("✅ Database connection successful")
            
            # Count records
            courses_count = await session.execute(select(Course))
            courses = len(courses_count.scalars().all())
            
            users_count = await session.execute(select(User))
            users = len(users_count.scalars().all())
            
            print(f"📊 Database statistics:")
            print(f"  📚 Courses: {courses}")
            print(f"  👥 Users: {users}")
            
    except Exception as e:
        print(f"❌ Database check failed: {e}")
        raise
    finally:
        await engine.dispose()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "reset":
            asyncio.run(reset_database())
        elif command == "check":
            asyncio.run(check_database())
        else:
            print("Available commands: reset, check")
            print("Usage: python init_db.py [command]")
    else:
        asyncio.run(init_database())