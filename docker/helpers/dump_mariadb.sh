#! /bin/bash

docker-compose exec mysqldb sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" $MYSQL_DATABASE -r /docker-entrypoint-initdb.d/$MYSQL_DATABASE.sql'

exit $?
