#!/bin/bash

# Barback Setup Script
# This script sets up the development environment for Barback

set -e

echo "🍻 Setting up Barback development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | sed 's/v//')
    REQUIRED_VERSION="18.0.0"
    
    if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
        print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    print_status "Node.js version $NODE_VERSION detected ✓"
}

# Check if PostgreSQL is installed and running
check_postgres() {
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed. Please install PostgreSQL from https://postgresql.org/"
        exit 1
    fi
    
    if ! pg_isready &> /dev/null; then
        print_warning "PostgreSQL is not running. Please start PostgreSQL service."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            print_status "On macOS, you can start PostgreSQL with: brew services start postgresql"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            print_status "On Linux, you can start PostgreSQL with: sudo systemctl start postgresql"
        fi
        read -p "Press Enter once PostgreSQL is running..."
    fi
    
    print_status "PostgreSQL is running ✓"
}

# Check if Redis is installed and running
check_redis() {
    if ! command -v redis-cli &> /dev/null; then
        print_warning "Redis is not installed. Installing Redis..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            if command -v brew &> /dev/null; then
                brew install redis
            else
                print_error "Homebrew not found. Please install Redis manually from https://redis.io/"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get update && sudo apt-get install -y redis-server
        fi
    fi
    
    if ! redis-cli ping &> /dev/null; then
        print_warning "Redis is not running. Starting Redis..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew services start redis
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo systemctl start redis
        fi
    fi
    
    print_status "Redis is running ✓"
}

# Create database
setup_database() {
    print_status "Setting up database..."
    
    # Create database user if it doesn't exist
    if ! psql -lqt | cut -d \| -f 1 | grep -qw barback; then
        print_status "Creating database 'barback'..."
        createdb barback
    else
        print_status "Database 'barback' already exists ✓"
    fi
    
    # Run migrations
    print_status "Running database migrations..."
    if [ -f "backend/migrations/001-create-tables.sql" ]; then
        psql -d barback -f backend/migrations/001-create-tables.sql
        print_status "Database migrations completed ✓"
    else
        print_warning "Migration file not found. You may need to run migrations manually."
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    print_status "All dependencies installed ✓"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Copy .env.example to .env if it doesn't exist
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_status "Created .env file from .env.example"
        print_warning "Please edit .env file with your actual configuration values"
    else
        print_status ".env file already exists ✓"
    fi
    
    # Copy backend .env.example to .env
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_status "Created backend/.env file"
    else
        print_status "Backend .env file already exists ✓"
    fi
    
    # Copy frontend .env.example to .env (if exists)
    if [ -f "frontend/.env.example" ] && [ ! -f "frontend/.env" ]; then
        cp frontend/.env.example frontend/.env
        print_status "Created frontend/.env file"
    fi
}

# Create log directories
setup_logging() {
    print_status "Setting up logging directories..."
    
    mkdir -p backend/logs
    mkdir -p logs
    
    print_status "Log directories created ✓"
}

# Verify Stripe configuration
verify_stripe() {
    print_warning "Stripe Configuration Required"
    echo "To use payment features, you need to:"
    echo "1. Create a Stripe account at https://stripe.com"
    echo "2. Get your API keys from the Stripe Dashboard"
    echo "3. Update STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in your .env files"
    echo "4. Set up webhook endpoints for payment events"
    echo ""
}

# Main setup function
main() {
    echo "🍻 Welcome to Barback Setup!"
    echo "This script will set up your development environment."
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_node
    check_postgres
    check_redis
    
    # Setup steps
    setup_environment
    install_dependencies
    setup_database
    setup_logging
    
    # Final instructions
    echo ""
    print_status "🎉 Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Edit your .env files with your actual configuration"
    echo "2. Set up your Stripe account and API keys"
    echo "3. Start the development server with: npm run dev"
    echo ""
    verify_stripe
    echo ""
    print_status "Happy coding! 🚀"
}

# Run main function
main "$@"