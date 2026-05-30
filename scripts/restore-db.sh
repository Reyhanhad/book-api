#!/usr/bin/env bash

set -e

BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./scripts/restore-db.sh <backup-file>"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "Restoring database from: $BACKUP_FILE"

cat "$BACKUP_FILE" | docker compose exec -T db psql \
  -U book_user \
  -d book_db

echo "Database restore completed."
