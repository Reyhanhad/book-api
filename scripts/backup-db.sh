#!/usr/bin/env bash

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/book_db_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo "Creating database backup..."

docker compose exec -T db pg_dump \
  -U book_user \
  -d book_db \
  > "$BACKUP_FILE"

echo "Backup created: $BACKUP_FILE"
