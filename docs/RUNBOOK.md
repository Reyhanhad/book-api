# Book API Runbook

## Service Architecture

Client → Nginx → Express API → PostgreSQL

## Important Commands

### Check containers

```bash
docker compose ps -a

Used to verify whether app and database containers are running, exited, unhealthy, or restarting.

Check app logs
docker compose logs --tail=100 app

Used to inspect Express API startup errors, database connection errors, syntax errors, and runtime exceptions.

Check database logs
docker compose logs --tail=100 db

Used to inspect PostgreSQL startup, shutdown, connection, and health issues.

Check Nginx error log
sudo tail -50 /var/log/nginx/error.log

Used to inspect reverse proxy errors such as 502 Bad Gateway and upstream connection failures.

Incident: 502 Bad Gateway
Symptom
HTTP/1.1 502 Bad Gateway
Meaning

Nginx is running, but it cannot connect to the backend Express API.

Diagnosis
docker compose ps -a
docker compose logs --tail=100 app
docker compose logs --tail=100 db
sudo tail -50 /var/log/nginx/error.log
Possible Root Causes
Express API container is stopped
Express API container is restarting
PostgreSQL container is stopped
Express API cannot resolve or connect to db
Port 3000 is not available on 127.0.0.1
Recovery
docker compose start db
docker compose restart app

If still broken:

docker compose down
docker compose up -d --build

Do not use:

docker compose down -v

unless you intentionally want to delete the database volume.
