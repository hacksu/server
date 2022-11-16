#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

MONGO_VERSION=4.4

if ! [ -x "$(command -v mongo)" ]; then
    echo "Installing MongoDB";
    source $REPO/scripts/setup/env.sh
#   fetch package registry
    sudo apt-get update -y
#   install gnupg
    sudo apt-get install gnupg -y
#   add mongodb pgp key
    wget -qO - https://www.mongodb.org/static/pgp/server-$MONGO_VERSION.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/$MONGO_VERSION multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-$MONGO_VERSION.list
#   fetch package registry
    sudo apt-get update -y
#   install mongodb
    sudo apt-get install -y mongodb-org
#   start mongodb
    systemctl start mongod.service
#   enable mongodb on restart
    systemctl enable mongod
fi

# show mongodb status
systemctl status mongod
# get connection status
mongo --eval 'db.runCommand({ connectionStatus: 1 })'