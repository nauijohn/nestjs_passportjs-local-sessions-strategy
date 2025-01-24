echo 'Stopping docker containers...'

docker compose -p backend_nestjs_auth-sessions \
	-f .docker/docker-compose.yml \
	\
	down # -f .docker/docker-compose.dev.yml \
