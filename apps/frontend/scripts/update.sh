#!/bin/bash
# ===========================================
# Update Script for Production Deployment
# ===========================================
# Usage:
#   ./scripts/update.sh          # Update with HTTP only
#   ./scripts/update.sh --ssl    # Update with SSL
#   ./scripts/update.sh --help   # Show help

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Default compose file
COMPOSE_FILE="docker-compose.prod.yml"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --ssl)
            COMPOSE_FILE="docker-compose.prod-ssl.yml"
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --ssl     Use SSL configuration"
            echo "  --help    Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

echo -e "${YELLOW}=== 911 Frontend Update Script ===${NC}"
echo ""

# Change to project directory
cd "$PROJECT_DIR"
echo -e "${GREEN}Working directory: $PROJECT_DIR${NC}"
echo -e "${GREEN}Using compose file: $COMPOSE_FILE${NC}"
echo ""

# Pull latest changes from git
echo -e "${YELLOW}[1/4] Pulling latest changes from git...${NC}"
git pull origin main
echo ""

# Stop current containers
echo -e "${YELLOW}[2/4] Stopping current containers...${NC}"
docker-compose -f "$COMPOSE_FILE" down
echo ""

# Build and start containers
echo -e "${YELLOW}[3/4] Building and starting containers...${NC}"
docker-compose -f "$COMPOSE_FILE" up -d --build
echo ""

# Check status
echo -e "${YELLOW}[4/4] Checking container status...${NC}"
docker-compose -f "$COMPOSE_FILE" ps
echo ""

# Health check
echo -e "${YELLOW}Waiting for health check...${NC}"
sleep 10

if curl -s -o /dev/null -w "%{http_code}" http://localhost/health | grep -q "200"; then
    echo -e "${GREEN}✓ Health check passed!${NC}"
else
    echo -e "${RED}✗ Health check failed. Check logs:${NC}"
    echo "  docker-compose -f $COMPOSE_FILE logs -f"
    exit 1
fi

echo ""
echo -e "${GREEN}=== Update completed successfully! ===${NC}"
echo ""
echo "Access the application at:"
if [[ "$COMPOSE_FILE" == *"ssl"* ]]; then
    echo "  https://89.169.1.53"
else
    echo "  http://89.169.1.53"
fi
echo ""
echo "Useful commands:"
echo "  View logs:      docker-compose -f $COMPOSE_FILE logs -f"
echo "  Check status:   docker-compose -f $COMPOSE_FILE ps"
echo "  Restart:        docker-compose -f $COMPOSE_FILE restart"
echo "  Stop:           docker-compose -f $COMPOSE_FILE down"

