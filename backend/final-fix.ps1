# final-fix.ps1
Write-Host "🔧 Final Fix Script - Resolving all issues..." -ForegroundColor Green

# 1. Check if we're in the right directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# 2. Fix backend virtual environment and dependencies
Write-Host "📦 Fixing backend..." -ForegroundColor Yellow
Set-Location backend

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "🔨 Creating virtual environment..." -ForegroundColor Cyan
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔌 Activating virtual environment..." -ForegroundColor Cyan
& ".\venv\Scripts\Activate.ps1"

# Verify activation and install dependencies
Write-Host "📥 Installing/upgrading Python dependencies..." -ForegroundColor Cyan
python -m pip install --upgrade pip
pip install -r requirements.txt

# Verify key packages are installed
Write-Host "🔍 Verifying Python packages..." -ForegroundColor Cyan
$packages = @("fastapi", "sqlalchemy", "pydantic", "uvicorn")
foreach ($package in $packages) {
    $result = pip show $package 2>$null
    if ($result) {
        Write-Host "✅ $package installed" -ForegroundColor Green
    } else {
        Write-Host "❌ $package NOT installed" -ForegroundColor Red
        pip install $package
    }
}

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Cyan
    @"
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/course_store
SECRET_KEY=course-store-secret-key-$(Get-Date -UFormat %s)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
"@ | Out-File -FilePath ".env" -Encoding UTF8
}

Set-Location ..

# 3. Fix frontend dependencies
Write-Host "📦 Fixing frontend..." -ForegroundColor Yellow
Set-Location frontend

# Install all dependencies
Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Cyan
npm install

# Install missing Tailwind dependencies
Write-Host "🎨 Installing Tailwind CSS..." -ForegroundColor Cyan
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npm install axios lucide-react

# Update package.json to include type: module
Write-Host "📝 Updating package.json..." -ForegroundColor Cyan
$packageJson = @"
{
  "name": "frontend",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build", 
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.6.1",
    "axios": "^1.6.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
"@
$packageJson | Out-File -FilePath "package.json" -Encoding UTF8

# Create/update PostCSS config
Write-Host "⚙️ Updating PostCSS config..." -ForegroundColor Cyan
$postcssConfig = @"
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
}
"@
$postcssConfig | Out-File -FilePath "postcss.config.js" -Encoding UTF8

# Initialize Tailwind if config doesn't exist
if (-not (Test-Path "tailwind.config.js")) {
    Write-Host "🎨 Initializing Tailwind..." -ForegroundColor Cyan
    npx tailwindcss init
}

Set-Location ..

# 4. Create VS Code settings
Write-Host "⚙️ Creating VS Code settings..." -ForegroundColor Yellow
if (-not (Test-Path ".vscode")) {
    New-Item -ItemType Directory -Path ".vscode"
}

$vscodeSettings = @"
{
  "python.defaultInterpreterPath": "./backend/venv/Scripts/python.exe",
  "python.terminal.activateEnvironment": true,
  "css.validate": false,
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "javascriptreact": "javascriptreact"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.inlineSuggest.enabled": true
}
"@
$vscodeSettings | Out-File -FilePath ".vscode/settings.json" -Encoding UTF8

# 5. Check Docker
Write-Host "🐳 Checking Docker..." -ForegroundColor Yellow
try {
    $dockerRunning = docker ps 2>$null
    if ($dockerRunning) {
        Write-Host "✅ Docker is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Docker is not running. Please start Docker." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Docker is not installed or not available." -ForegroundColor Yellow
}

# 6. Test installations
Write-Host "🧪 Testing installations..." -ForegroundColor Yellow

# Test Python packages in virtual environment
Set-Location backend
& ".\venv\Scripts\Activate.ps1"
$pythonTest = python -c "import fastapi, sqlalchemy, pydantic; print('✅ Python packages OK')" 2>$null
if ($pythonTest) {
    Write-Host $pythonTest -ForegroundColor Green
} else {
    Write-Host "❌ Python packages test failed" -ForegroundColor Red
}

Set-Location ..\frontend
# Test Node packages
$nodeTest = npm list axios react tailwindcss 2>$null
if ($nodeTest -match "axios" -and $nodeTest -match "react" -and $nodeTest -match "tailwindcss") {
    Write-Host "✅ Frontend packages OK" -ForegroundColor Green
} else {
    Write-Host "❌ Some frontend packages missing, running npm install again..." -ForegroundColor Yellow
    npm install
}

Set-Location ..

Write-Host ""
Write-Host "🎉 Final fix completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start database: docker-compose up -d postgres" -ForegroundColor White
Write-Host "2. Initialize DB: cd backend && .\venv\Scripts\Activate.ps1 && python init_db.py" -ForegroundColor White
Write-Host "3. Start backend: cd backend && .\venv\Scripts\Activate.ps1 && uvicorn app.main:app --reload" -ForegroundColor White
Write-Host "4. Start frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Access points:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend: http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "👤 Test accounts:" -ForegroundColor Cyan
Write-Host "  admin@coursestore.ru / admin123" -ForegroundColor White
Write-Host "  test@example.com / test123" -ForegroundColor White