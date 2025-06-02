#!/bin/bash
# setup.sh - Course Store Setup Script

set -e

echo "🚀 Course Store Setup Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed ✓"
}

# Create environment file
setup_env() {
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp .env.example .env
        print_warning "Please review and update the .env file with your settings"
    else
        print_status ".env file already exists ✓"
    fi
}

# Build and start services
start_services() {
    print_status "Building and starting services..."
    docker-compose down --remove-orphans
    docker-compose build --no-cache
    docker-compose up -d
    
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_status "Services started successfully ✓"
    else
        print_error "Some services failed to start"
        docker-compose logs
        exit 1
    fi
}

# Initialize database
init_database() {
    print_status "Initializing database..."
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    docker-compose exec -T db sh -c 'until pg_isready -U postgres -d course_marketplace; do sleep 1; done'
    
    # Run database initialization
    docker-compose exec -T backend python init_db.py
    
    print_status "Database initialized ✓"
}

# Show status and access information
show_status() {
    echo ""
    echo -e "${BLUE}🎉 Course Store is now running!${NC}"
    echo "================================="
    echo ""
    echo "📱 Access URLs:"
    echo "   Frontend:  http://localhost:5173"
    echo "   Backend:   http://localhost:8000"
    echo "   API Docs:  http://localhost:8000/docs"
    echo ""
    echo "🔐 Test Accounts:"
    echo "   Admin:     admin@coursestore.ru / admin123"
    echo "   User:      test@example.com / test123"
    echo ""
    echo "🛠️  Management Commands:"
    echo "   View logs:     docker-compose logs -f"
    echo "   Stop:          docker-compose down"
    echo "   Restart:       docker-compose restart"
    echo "   Shell access:  docker-compose exec backend bash"
    echo ""
}

# Main execution
main() {
    echo "Starting setup process..."
    
    check_docker
    setup_env
    start_services
    init_database
    show_status
    
    print_status "Setup completed successfully! 🎉"
}

# Handle script arguments
case "${1:-}" in
    "start")
        start_services
        ;;
    "init")
        init_database
        ;;
    "status")
        docker-compose ps
        ;;
    "logs")
        docker-compose logs -f "${2:-}"
        ;;
    "stop")
        docker-compose down
        ;;
    "clean")
        docker-compose down -v --remove-orphans
        docker system prune -f
        ;;
    "shell")
        docker-compose exec backend bash
        ;;
    *)
        main
        ;;
esac