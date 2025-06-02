# fix-db-simple.py - Simple database fix without complex imports
import sqlite3
import hashlib
import os

# Change to backend directory
os.chdir('backend')

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def setup_database():
    print("🔧 Setting up SQLite database directly...")
    
    # Create SQLite database
    conn = sqlite3.connect('course_store.db')
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create courses table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            instructor TEXT,
            duration TEXT,
            level TEXT,
            image_url TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create cart_items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cart_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            course_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (course_id) REFERENCES courses (id)
        )
    ''')
    
    # Create order_items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            course_id INTEGER,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id),
            FOREIGN KEY (course_id) REFERENCES courses (id)
        )
    ''')
    
    # Check if data already exists
    cursor.execute("SELECT COUNT(*) FROM courses")
    course_count = cursor.fetchone()[0]
    
    if course_count == 0:
        print("📚 Adding sample courses...")
        courses = [
            ("Курс по веб-разработке", "Научитесь создавать современные сайты с нуля! Изучите HTML, CSS, JavaScript и современные фреймворки.", 5000.0, "Иван Иванов", "8 недель", "Начинающий", "/images/web-dev.jpg"),
            ("Курс по дизайну", "Освойте основы графического дизайна и UX/UI. Научитесь работать в Figma, Adobe Creative Suite.", 4500.0, "Мария Петрова", "6 недель", "Начинающий", "/images/design.jpg"),
            ("Курс по программированию на Python", "Станьте профессиональным разработчиком на Python! От основ до продвинутых техник.", 6000.0, "Алексей Сидоров", "12 недель", "Средний", "/images/python.jpg"),
            ("Курс по Data Science", "Изучите анализ данных, машинное обучение и работу с большими данными.", 8000.0, "Елена Козлова", "16 недель", "Продвинутый", "/images/data-science.jpg"),
            ("Курс по мобильной разработке", "Создавайте мобильные приложения для iOS и Android с React Native.", 7000.0, "Дмитрий Волков", "10 недель", "Средний", "/images/mobile.jpg")
        ]
        
        cursor.executemany('''
            INSERT INTO courses (title, description, price, instructor, duration, level, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', courses)
        print(f"✅ Added {len(courses)} courses")
    else:
        print(f"📚 Courses already exist ({course_count} found)")
    
    # Check if users already exist
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    
    if user_count == 0:
        print("👥 Adding sample users...")
        users = [
            ("Администратор", "admin@coursestore.ru", hash_password("admin123")),
            ("Тестовый пользователь", "test@example.com", hash_password("test123"))
        ]
        
        cursor.executemany('''
            INSERT INTO users (name, email, hashed_password)
            VALUES (?, ?, ?)
        ''', users)
        print(f"✅ Added {len(users)} users")
    else:
        print(f"👥 Users already exist ({user_count} found)")
    
    # Commit changes and close
    conn.commit()
    conn.close()
    
    print("\n🎉 Database setup completed!")
    print("\n📋 Test Accounts:")
    print("  👤 Admin: admin@coursestore.ru / admin123")
    print("  👤 User: test@example.com / test123")
    print("\n🚀 Ready to start the application!")

if __name__ == "__main__":
    setup_database()