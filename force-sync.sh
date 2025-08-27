#!/bin/bash

# Force sync script to ensure all files are pushed to GitHub
# This will overwrite remote files with local versions

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting force sync to GitHub...${NC}"

# Add all files
git add -A

# Create a commit even if no changes
git commit --allow-empty -m "Force sync: Complete platform update $(date '+%Y-%m-%d %H:%M:%S')"

# Configure git to use token and force push
if [ ! -z "$GITHUB_TOKEN" ]; then
    # Set remote URL with token for this push only
    REMOTE_URL="https://${GITHUB_TOKEN}@github.com/keevingfu/geosys.git"
    echo -e "${YELLOW}Force pushing to GitHub...${NC}"
    git push $REMOTE_URL main --force
else
    # Fallback to regular push
    git push origin main --force
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Successfully force synced all files to GitHub!${NC}"
    echo -e "${GREEN}All HTML pages have been synchronized.${NC}"
else
    echo -e "${RED}Failed to force push to GitHub${NC}"
    exit 1
fi