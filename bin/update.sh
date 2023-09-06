#!/bin/bash
# Pull the latest changes
git pull origin main --ff-only

# Stop and remove the old container
docker-compose down

# Remove the old Docker image
docker rmi prompt-master:latest

# Build the new Docker image
docker-compose build

# Start a new container with the updated image
docker-compose up -d
