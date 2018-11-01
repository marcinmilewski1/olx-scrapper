depends:
	docker-compose up --build -d --remove-orphans

clean:
	docker-compose down -v

run:
	docker-compose up --build --remove-orphans
