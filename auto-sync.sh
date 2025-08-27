#!/bin/bash

# Auto-sync script for GitHub
# This script automatically commits and pushes changes to GitHub

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting auto-sync to GitHub...${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Add all changes
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}No changes to commit${NC}"
else
    # Generate commit message with timestamp
    COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Commit changes
    git commit -m "$COMMIT_MSG"
    echo -e "${GREEN}Changes committed${NC}"
fi

# Configure git to use token
if [ ! -z "$GITHUB_TOKEN" ]; then
    # Set remote URL with token for this push only
    REMOTE_URL="https://${GITHUB_TOKEN}@github.com/keevingfu/geosys.git"
    git push $REMOTE_URL main
else
    # Fallback to regular push
    git push origin main
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully synced to GitHub!${NC}"
else
    echo -e "${RED}Failed to push to GitHub${NC}"
    exit 1
fi