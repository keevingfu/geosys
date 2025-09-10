#!/bin/bash

# Database backup script for Dymesty FAQ DAM

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backup"
BACKUP_FILE="$BACKUP_DIR/dymestydam_backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Backing up Dymesty FAQ DAM database..."
docker exec dymesty-postgres pg_dump -U dymesty_admin dymestydam > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "Backup successful: $BACKUP_FILE"
    
    # Compress the backup
    gzip $BACKUP_FILE
    echo "Compressed: ${BACKUP_FILE}.gz"
    
    # Keep only last 7 backups
    cd $BACKUP_DIR
    ls -t *.gz | tail -n +8 | xargs -r rm
    echo "Cleanup complete. Keeping last 7 backups."
else
    echo "Backup failed!"
    exit 1
fi