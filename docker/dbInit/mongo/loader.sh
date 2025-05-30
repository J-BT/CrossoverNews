#! /bin/bash

# Retrieve mongo dbname, test if the folder exists, then load it if present

dbname=${MONGO_INITDB_DATABASE}
dumpfolder=/docker-entrypoint-initdb.d/${dbname}

if [ ! -d ${dumpfolder} ]; then
  echo "db folder ${dumpfolder} absent. stop"
  exit 0
fi

mongorestore --db ${dbname} ${dumpfolder}
exit $?
