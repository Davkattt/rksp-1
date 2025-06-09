# Course Marketplace / Интернет-магазин курсов

A full-stack web application for selling online courses with user authentication and course management.

Полнофункциональное веб-приложение для продажи онлайн-курсов с аутентификацией пользователей и управлением курсами.

## 🇺🇸 English

### Features

- **User Authentication**: Registration, login, and profile management
- **Course Catalog**: Browse and view available courses
- **Shopping Cart**: Add courses to cart and manage purchases
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Tech Stack**: React frontend with FastAPI backend

### Technology Stack

#### Frontend
- **React 18** - Modern JavaScript framework
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling

#### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Database (with AsyncPG driver)
- **JWT Authentication** - Secure token-based auth
- **Passlib + Bcrypt** - Password hashing
- **Python-JOSE** - JWT token handling

### Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── app/             # Main app components
│   │   ├── assets/          # CSS and static files
│   │   ├── layouts/         # Layout components
│   │   └── pages/           # Page components
│   ├── package.json
│   └── vite.config.js
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── auth.py          # Authentication logic
│   │   ├── crud.py          # Database operations
│   │   ├── database.py      # Database configuration
│   │   ├── main.py          # FastAPI app and routes
│   │   ├── models.py        # SQLAlchemy models
│   │   └── schemas.py       # Pydantic schemas
│   └── requirements.txt
└── *.html                   # Static HTML pages (legacy)
```

### Prerequisites

- **Docker** and **Docker Compose**

### Quick Start with Docker (Recommended)

#### 1. Clone the Repository
```bash
git clone https://github.com/Davkattt/rksp-1
cd rksp-1
```

#### 2. Run with Docker Compose
```bash
# Start all services (database, backend, frontend)
docker-compose up --build
```

That's it! The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

#### 3. Stop the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### Manual Installation (Alternative)

If you prefer to run without Docker:

#### Prerequisites for Manual Setup
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** database

#### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file with:
DATABASE_URL=postgresql+asyncpg://username:password@localhost/dbname
```

#### 2. Database Setup
```bash
# Create PostgreSQL database
createdb course_marketplace

# The application will automatically create tables on startup
```

#### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

#### 4. Running the Application

**Backend (Terminal 1):**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### API Endpoints

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/me` - Get current user profile
- `GET /api/` - Health check

### Usage

1. **Registration**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Browse Courses**: View available courses on the homepage and `/courses`
4. **Shopping Cart**: Add courses to cart at `/cart`
5. **Profile**: View your profile at `/profile` (requires login)

---

## 🇷🇺 Русский

### Функциональность

- **Аутентификация пользователей**: Регистрация, вход и управление профилем
- **Каталог курсов**: Просмотр доступных курсов
- **Корзина покупок**: Добавление курсов в корзину и управление покупками
- **Адаптивный дизайн**: Работает на десктопе и мобильных устройствах
- **Современный стек технологий**: React фронтенд с FastAPI бэкендом

### Стек технологий

#### Фронтенд
- **React 18** - Современный JavaScript фреймворк
- **React Router DOM** - Клиентская маршрутизация
- **Vite** - Быстрый инструмент сборки и сервер разработки
- **CSS3** - Пользовательские стили

#### Бэкенд
- **FastAPI** - Современный Python веб-фреймворк
- **SQLAlchemy** - SQL инструментарий и ORM
- **PostgreSQL** - База данных (с драйвером AsyncPG)
- **JWT Authentication** - Безопасная аутентификация на основе токенов
- **Passlib + Bcrypt** - Хеширование паролей
- **Python-JOSE** - Обработка JWT токенов

### Структура проекта

```
├── frontend/                 # React фронтенд приложение
│   ├── src/
│   │   ├── app/             # Основные компоненты приложения
│   │   ├── assets/          # CSS и статические файлы
│   │   ├── layouts/         # Компоненты макетов
│   │   └── pages/           # Компоненты страниц
│   ├── package.json
│   └── vite.config.js
├── backend/                 # FastAPI бэкенд приложение
│   ├── app/
│   │   ├── auth.py          # Логика аутентификации
│   │   ├── crud.py          # Операции с базой данных
│   │   ├── database.py      # Конфигурация базы данных
│   │   ├── main.py          # FastAPI приложение и маршруты
│   │   ├── models.py        # SQLAlchemy модели
│   │   └── schemas.py       # Pydantic схемы
│   └── requirements.txt
└── *.html                   # Статические HTML страницы (legacy)
```

### Требования

- **Node.js** (v18 или выше)
- **Python** (v3.8 или выше)
- **PostgreSQL** база данных

### Установка и настройка

#### 1. Клонирование репозитория
```bash
git clone https://github.com/Davkattt/rksp-1
cd rksp-1
```

#### 2. Настройка бэкенда
```bash
# Переход в директорию бэкенда
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация виртуального окружения
# На Windows:
venv\Scripts\activate
# На macOS/Linux:
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Настройка переменных окружения
# Создайте файл .env с:
DATABASE_URL=postgresql+asyncpg://username:password@localhost/dbname
```

#### 3. Настройка базы данных
```bash
# Создание базы данных PostgreSQL
createdb course_marketplace

# Приложение автоматически создаст таблицы при запуске
```

#### 4. Настройка фронтенда
```bash
# Переход в директорию фронтенда
cd ../frontend

# Установка зависимостей
npm install
```

#### 5. Запуск приложения

**Бэкенд (Терминал 1):**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

**Фронтенд (Терминал 2):**
```bash
cd frontend
npm run dev
```

Приложение будет доступно по адресам:
- Фронтенд: http://localhost:5173
- Бэкенд API: http://localhost:8000
- Документация API: http://localhost:8000/docs

### API эндпоинты

- `POST /api/register` - Регистрация пользователя
- `POST /api/login` - Вход пользователя
- `GET /api/me` - Получение профиля текущего пользователя
- `GET /api/` - Проверка состояния

### Использование

1. **Регистрация**: Создайте новый аккаунт на `/register`
2. **Вход**: Войдите в систему на `/login`
3. **Просмотр курсов**: Просматривайте доступные курсы на главной странице и `/courses`
4. **Корзина покупок**: Добавляйте курсы в корзину на `/cart`
5. **Профиль**: Просматривайте свой профиль на `/profile` (требуется вход)

---

## Development Notes / Примечания для разработки

### Environment Variables / Переменные окружения

Create a `.env` file in the backend directory:

Создайте файл `.env` в директории backend:

```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost/database_name
SECRET_KEY=your-secret-key-here
```

### Database Migration / Миграция базы данных

The application uses SQLAlchemy with automatic table creation. For production, consider using Alembic for database migrations.

Приложение использует SQLAlchemy с автоматическим созданием таблиц. Для продакшена рассмотрите использование Alembic для миграций базы данных.

### Contributing / Участие в разработке

1. Fork the repository / Форкните репозиторий
2. Create a feature branch / Создайте ветку для функции
3. Make your changes / Внесите изменения
4. Submit a pull request / Отправьте pull request

## License / Лицензия

This project is licensed under the MIT License.

Этот проект лицензирован под лицензией MIT.