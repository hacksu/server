#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

if ! [ -x "$(command -v mongo)" ]; then
    echo "Installing MongoDB";
    source $REPO/scripts/setup/env.sh
#   fetch package registry
    sudo apt update -y
#   install gnupg
    sudo apt install gnupg -y
#   add mongodb pgp key
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
#   fetch package registry
    sudo apt update -y
#   install mongodb
    sudo apt install -y mongodb-org
#   start mongodb
    systemctl start mongod.service
#   enable mongodb on restart
    systemctl enable mongod
fi

# show mongodb status
systemctl status mongod
# get connection status
mongo --eval 'db.runCommand({ connectionStatus: 1 })'