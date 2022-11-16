#!/bin/bash

# Environment Variables
CWD=$( pwd );
SWD=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if ! [ -x "$(command -v npm)" ]; then
    sh ./node.sh
fi

if [ -x "$()" ]; then
#   create pm2 directory
    mkdir /opt/pm2
#   set permissions so all users may access it
    chmod -R 777 /opt/pm2

fi

npm i -g