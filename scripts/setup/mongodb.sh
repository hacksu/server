#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

MONGO_VERSION=4.4
if [ -x "$(command -v mongo)" ]; then
    echo "MongoDB is already installed"
elif [ -x "$(command -v mongosh)" ]; then
    echo "MongoDB is already installed"
else
# if ! [ -x "$(command -v mongo)" && -x "$(command -v mongosh)" ]; then
    echo "Installing MongoDB";
    source $REPO/scripts/setup/env.sh
#   add ubuntu 20.xx (focal) sources and mongodb pgp key
    sudo apt-get install gnupg -y
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb http://security.ubuntu.com/ubuntu focal-security main" | sudo tee /etc/apt/sources.list.d/focal-security.list
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
#   fetch package registry
    sudo apt-get update -y
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
elif [ -x "$(command -v mongo)" ]; then
    # get connection status
    mongo --eval 'db.runCommand({ connectionStatus: 1 })'
    # show mongodb status
    systemctl status mongod
fi
