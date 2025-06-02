# scripts/docker-dev.sh
#!/bin/bash
# Development Docker setup

set -e

echo "🐳 Setting up Course Store for development..."

# Build and start services
echo "📦 Building and starting services..."
docker-compose up --build -d

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 10

# Initialize database
echo "🗄️ Initializing database..."
docker-compose exec backend python init_db.py

echo "✅ Development environment ready!"
echo ""
echo "🔗 Access points:"
echo "  Frontend: http://localhost"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "👤 Test accounts:"
echo "  admin@coursestore.ru / admin123"
echo "  test@example.com / test123"

# scripts/docker-prod.sh
#!/bin/bash
# Production Docker setup

set -e

echo "🚀 Setting up Course Store for production..."

# Build and start services
echo "📦 Building and starting services..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 15

# Initialize database
echo "🗄️ Initializing database..."
docker-compose exec backend python init_db.py

echo "✅ Production environment ready!"
echo ""
echo "🔗 Access points:"
echo "  Application: http://localhost"
echo "  API: http://localhost:8000"

# scripts/docker-stop.sh
#!/bin/bash
# Stop all services

echo "🛑 Stopping Course Store services..."
docker-compose down

echo "✅ All services stopped!"

# scripts/docker-clean.sh
#!/bin/bash
# Clean up Docker resources

echo "🧹 Cleaning up Docker resources..."

# Stop services
docker-compose down

# Remove volumes (CAREFUL: This deletes all data!)
read -p "⚠️  Remove all data volumes? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v
    docker volume prune -f
    echo "🗑️ Volumes removed"
fi

# Remove images
read -p "🗑️ Remove built images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down --rmi all
    echo "🗑️ Images removed"
fi

echo "✅ Cleanup complete!"

# scripts/docker-logs.sh
#!/bin/bash
# View logs for all services

if [ $# -eq 0 ]; then
    echo "📋 Showing logs for all services..."
    docker-compose logs -f
else
    echo "📋 Showing logs for $1..."
    docker-compose logs -f $1
fi