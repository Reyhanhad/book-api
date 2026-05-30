#!/usr/bin/env bash

set -e

echo "Pulling latest code from GitHub..."
git pull --ff-only origin main

echo "Building and restarting containers..."
docker compose up -d --build

echo "Checking container status..."
docker compose ps

echo "Deployment finished."
