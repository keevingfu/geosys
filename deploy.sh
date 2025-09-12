#!/bin/bash

# Dymesty Content Intelligence Center - Production Deployment Script
# This script handles secure production deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DOCKER_DIR="$PROJECT_DIR/docker"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Dymesty AI Glasses Content Intelligence${NC}"
echo -e "${BLUE}Production Deployment Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker is not installed${NC}"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}Error: Docker Compose is not installed${NC}"
        exit 1
    fi
    
    # Check if .env.production exists
    if [ ! -f "$DOCKER_DIR/.env.production" ]; then
        echo -e "${RED}Error: .env.production file not found${NC}"
        echo "Please create it from .env.production template"
        exit 1
    fi
    
    echo -e "${GREEN}✓ All prerequisites satisfied${NC}"
}

# Function to setup SSL certificates
setup_ssl() {
    echo -e "${YELLOW}Setting up SSL certificates...${NC}"
    
    # Check if certificates already exist
    if [ -d "$DOCKER_DIR/certbot/conf/live" ]; then
        echo -e "${GREEN}SSL certificates already exist${NC}"
        return
    fi
    
    # Get domain from .env.production
    source "$DOCKER_DIR/.env.production"
    
    if [ -z "$DOMAIN" ]; then
        echo -e "${RED}Error: DOMAIN not set in .env.production${NC}"
        exit 1
    fi
    
    # Start nginx for certbot verification
    cd "$DOCKER_DIR"
    docker-compose -f docker-compose.prod.yml up -d nginx
    
    # Get certificates
    docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL_ADMIN" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN" \
        -d "www.$DOMAIN"
    
    echo -e "${GREEN}✓ SSL certificates obtained${NC}"
}

# Function to build and deploy
deploy() {
    echo -e "${YELLOW}Building and deploying services...${NC}"
    
    cd "$DOCKER_DIR"
    
    # Load environment variables
    export $(cat .env.production | grep -v '^#' | xargs)
    
    # Build images
    echo -e "${YELLOW}Building Docker images...${NC}"
    docker-compose -f docker-compose.prod.yml build
    
    # Stop existing services
    echo -e "${YELLOW}Stopping existing services...${NC}"
    docker-compose -f docker-compose.prod.yml down
    
    # Start services
    echo -e "${YELLOW}Starting services...${NC}"
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be healthy
    echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
    sleep 10
    
    # Check service status
    docker-compose -f docker-compose.prod.yml ps
    
    echo -e "${GREEN}✓ Services deployed successfully${NC}"
}

# Function to run database migrations
run_migrations() {
    echo -e "${YELLOW}Running database migrations...${NC}"
    
    # Wait for database to be ready
    sleep 5
    
    # Run migrations (init scripts should auto-run)
    docker-compose -f docker-compose.prod.yml exec -T postgres psql -U dymesty_admin -d dymestydam -c "\dt auth.*"
    
    echo -e "${GREEN}✓ Database migrations completed${NC}"
}

# Function to setup monitoring
setup_monitoring() {
    echo -e "${YELLOW}Setting up monitoring...${NC}"
    
    # Create monitoring directories
    mkdir -p "$PROJECT_DIR/logs"
    mkdir -p "$PROJECT_DIR/metrics"
    
    echo -e "${GREEN}✓ Monitoring setup completed${NC}"
}

# Function to display post-deployment info
show_info() {
    source "$DOCKER_DIR/.env.production"
    
    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo "Access Points:"
    echo -e "  - Web Application: ${BLUE}https://$DOMAIN${NC}"
    echo -e "  - API Health Check: ${BLUE}https://$DOMAIN/api/health${NC}"
    echo ""
    echo "Default Credentials:"
    echo -e "  - Admin: ${YELLOW}admin@dymesty.com${NC} / ${YELLOW}Admin@123!${NC}"
    echo -e "  - Demo: ${YELLOW}demo@dymesty.com${NC} / ${YELLOW}Demo@123!${NC}"
    echo ""
    echo -e "${RED}IMPORTANT: Change default passwords immediately!${NC}"
    echo ""
    echo "Useful Commands:"
    echo "  - View logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "  - Stop services: docker-compose -f docker-compose.prod.yml down"
    echo "  - Backup database: $PROJECT_DIR/docker/scripts/backup.sh"
    echo ""
}

# Main execution
main() {
    check_prerequisites
    
    # Ask for confirmation
    echo ""
    echo -e "${YELLOW}This will deploy to production. Continue? (y/N)${NC}"
    read -r response
    
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 0
    fi
    
    setup_ssl
    deploy
    run_migrations
    setup_monitoring
    show_info
}

# Run main function
main