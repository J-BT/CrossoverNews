#! /bin/bash

docker-compose exec mongo sh -c 'mongodump --db $MONGO_INITDB_DATABASE --out /docker-entrypoint-initdb.d/'

exit $?
