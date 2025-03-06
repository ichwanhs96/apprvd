#!/bin/bash
set -e

apt-get update
apt-get install -y mongodb-org-shell

# Start MongoDB with limited concurrency to allow for setup
mongod --bind_ip_all --fork --logpath /var/log/mongodb.log

# Wait for MongoDB to start
until mongo --eval "print(\"waited for connection\")"
do
    sleep 1
done

# Use environment variables to set database name and password
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}

# Create admin user and database-specific user
mongo <<EOF
use admin
db.createUser({
  user:  "root",
  pwd: "$DB_PASSWORD",
  roles: [ { role: "root", db: "admin" } ]
})

use $DB_NAME
db.createUser({
  user: "$DB_USER",
  pwd: "$DB_PASSWORD",
  roles: [ { role: "readWrite", db: "$DB_NAME" } ]
})
EOF

# Shutdown MongoDB
mongod --shutdown

# Start MongoDB normally
exec mongod --bind_ip_all