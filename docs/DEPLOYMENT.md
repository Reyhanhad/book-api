# Book API Deployment Guide

## 1. Architecture Overview

```text
Client
↓
Nginx :80
↓
Express API container :3000
↓
PostgreSQL container :5432
Uptime Kuma :3001

2. Server Requirements
Recommended server:

OS      : Ubuntu 24.04 LTS
RAM     : minimum 1 GB, recommended 2 GB+
Disk    : minimum 20 GB
Runtime : Docker + Docker Compose

3.Required Ports
22   SSH
80   HTTP / Nginx
3001 Uptime Kuma dashboard for lab environment

Production note:

Do not expose PostgreSQL port 5432 publicly.
Do not expose Express API port 3000 publicly.

4. Install Dependencies
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git nginx
sudo systemctl enable --now docker
sudo systemctl enable --now nginx
5. Clone Repository
git clone https://github.com/Reyhanhad/book-api.git
cd book-api
6. Configure Environment
cp .env.example .env
nano .env

Example:

PORT=3000

DB_HOST=db
DB_PORT=5432
DB_USER=book_user
DB_PASSWORD=book_password
DB_NAME=book_db

Important:

DB_HOST must be db because the Express API connects to PostgreSQL through Docker Compose internal networking.
7. Start Application
docker compose up -d --build

Check services:

docker compose ps

Expected services:

book-api
book-db
uptime-kuma
8. Configure Nginx Reverse Proxy

Create config:

sudo nano /etc/nginx/sites-available/book-api

Config:

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

Enable config:

sudo ln -s /etc/nginx/sites-available/book-api /etc/nginx/sites-enabled/book-api
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
9. Verify Deployment

From server:

curl -i http://localhost/health
curl -i http://localhost/api/books

Expected:

HTTP/1.1 200 OK
10. Deploy Updates

Use deployment script:

./deploy.sh

The script runs:

git pull --ff-only origin main
docker compose up -d --build
docker compose ps
11. Backup Database
./scripts/backup-db.sh

Backup files are stored in:

backups/
12. Restore Database
./scripts/restore-db.sh backups/<backup-file>.sql
13. Monitoring

Uptime Kuma dashboard:

http://localhost:3001

Monitor target inside Docker Compose:

http://app:3000/health

Do not use:

http://localhost:3000/health

because localhost inside the Uptime Kuma container refers to the Uptime Kuma container itself.

14. Common Troubleshooting
502 Bad Gateway

Meaning:

Nginx is running, but it cannot connect to the Express API backend.

Check:

docker compose ps -a
docker compose logs --tail=100 app
sudo tail -50 /var/log/nginx/error.log

Recovery:

docker compose restart app

If still broken:

docker compose down
docker compose up -d --build
Database Down

Check:

docker compose ps -a
docker compose logs --tail=100 db
curl -i http://localhost/health

Recovery:

docker compose start db
docker compose restart app
Do Not Delete Volumes Accidentally

Avoid:

docker compose down -v

unless you intentionally want to remove database data.

