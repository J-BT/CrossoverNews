#! /bin/bash
docker-compose exec mysqldb sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" $MYSQL_DATABASE'
