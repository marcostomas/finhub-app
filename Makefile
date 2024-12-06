.PHONY: build up down restart logs shell install

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose down && docker-compose up -d

logs:
	docker-compose logs -f

shell:
	docker exec -it angular-dev-container sh

install:
	docker exec -it angular-dev-container npm install
