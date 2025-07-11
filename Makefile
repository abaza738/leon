.PHONY: help dev prod build clean logs shell

# Default target
help:
	@echo "Available commands:"
	@echo "  dev     - Start development environment"
	@echo "  prod    - Start production environment"
	@echo "  build   - Build all containers"
	@echo "  clean   - Clean up containers and images"
	@echo "  logs    - Show logs for all services"
	@echo "  shell   - Open shell in client container"
	@echo "  down    - Stop all services"

# Development environment
dev:
	docker compose -f docker-compose.dev.yml up --build

# Production environment
prod:
	docker compose -f docker-compose.yml up --build -d

# Build all containers
build:
	docker compose -f docker-compose.yml build
	docker compose -f docker-compose.dev.yml build

# Clean up
clean:
	docker compose -f docker-compose.yml down -v --remove-orphans
	docker compose -f docker-compose.dev.yml down -v --remove-orphans
	docker system prune -f
	docker volume prune -f

# Show logs
logs:
	docker compose logs -f

# Open shell in client container (dev)
shell:
	docker compose -f docker-compose.dev.yml exec client sh

# Stop services
down:
	docker compose -f docker-compose.yml down
	docker compose -f docker-compose.dev.yml down
