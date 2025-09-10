#!/bin/bash

# Dymesty AI Glasses FAQ DAM - Docker Deployment Script
# This script handles Docker authentication and deployment

set -e  # Exit on any error

echo "========================================"
echo "Dymesty AI Glasses FAQ DAM Deployment"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker Desktop first.${NC}"
    exit 1
fi

# Docker Hub authentication
echo -e "${YELLOW}Authenticating with Docker Hub...${NC}"
if [ -z "$DOCKER_TOKEN" ]; then
    echo -e "${RED}Error: DOCKER_TOKEN environment variable not set${NC}"
    echo "Please set: export DOCKER_TOKEN=your_docker_token"
    exit 1
fi
echo "$DOCKER_TOKEN" | docker login -u vovolhuang --password-stdin

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker Hub authentication successful${NC}"
else
    echo -e "${RED}✗ Docker Hub authentication failed${NC}"
    exit 1
fi

# Create necessary directories
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p docker/api
mkdir -p docker/backup

# Navigate to docker directory
cd docker

# Stop and remove any existing containers
echo -e "${YELLOW}Cleaning up existing containers...${NC}"
docker-compose -p dymesty down -v 2>/dev/null || true

# Build and start services
echo -e "${YELLOW}Building and starting services...${NC}"
docker-compose -p dymesty up -d

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to initialize...${NC}"
sleep 10

# Check if services are running
echo -e "${YELLOW}Checking service status...${NC}"
docker-compose -p dymesty ps

# Show PostgreSQL logs
echo -e "${YELLOW}PostgreSQL initialization logs:${NC}"
docker logs dymesty-postgres | tail -20

# Test database connection
echo -e "${YELLOW}Testing database connection...${NC}"
docker exec dymesty-postgres psql -U dymesty_admin -d dymestydam -c "\dt faq.*" | head -20 || echo "Database not ready yet"

echo ""
echo "========================================"
echo -e "${GREEN}Deployment Complete!${NC}"
echo "========================================"
echo ""
echo "Access Points:"
echo "  - PostgreSQL: localhost:5435"
echo "  - Database: dymestydam"
echo "  - User: dymesty_admin"
echo "  - Password: DymestyAI2025!"
echo ""
echo "  - pgAdmin: http://localhost:5051"
echo "  - Email: admin@dymesty.com"
echo "  - Password: DymestyAdmin2025!"
echo ""
echo "  - API: http://localhost:4000"
echo ""
echo "Useful Commands:"
echo "  - View logs: docker-compose -p dymesty logs -f"
echo "  - Stop services: docker-compose -p dymesty down"
echo "  - Access PostgreSQL: docker exec -it dymesty-postgres psql -U dymesty_admin -d dymestydam"
echo "  - Backup database: ./backup.sh"
echo ""