#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

MONGO_VERSION=4.4

if ! [[ -x "$(command -v mongo)" ] && [ -x "$(command -v mongosh)" ]]; then
    echo "Installing MongoDB";
    source $REPO/scripts/setup/env.sh
#   add ubuntu 20.xx (focal) sources
    echo "deb http://security.ubuntu.com/ubuntu focal-security main" | sudo tee /etc/apt/sources.list.d/focal-security.list
#   add mongodb pgp key
    curl -fsSL https://www.mongodb.org/static/pgp/server-$MONGO_VERSION.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/$MONGO_VERSION multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-$MONGO_VERSION.list
#   fetch package registry
    sudo apt-get update -y
#   install gnupg
    sudo apt-get install -y gnupg libssl1.1
#   install mongodb
    sudo apt-get install -y mongodb-org
#   start mongodb
    systemctl start mongod.service
#   enable mongodb on restart
    systemctl enable mongod
fi

if [ -x "$(command -v mongosh)" ]; then
    # get connection status
    mongosh --eval 'db.runCommand({ connectionStatus: 1 })'
    # show mongodb status
    systemctl status mongodb
else if [ -x "$(command -v mongo)" ];
    # get connection status
    mongo --eval 'db.runCommand({ connectionStatus: 1 })'
    # show mongodb status
    systemctl status mongod
fi;
