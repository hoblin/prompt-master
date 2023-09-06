@echo off

REM Pull the latest changes
git pull origin main --ff-only

REM Stop and remove the old container
docker-compose down

REM Remove the old Docker image
docker rmi prompt-master:latest

REM Build the new Docker image
docker-compose build

REM Start a new container with the updated image
docker-compose up -d
