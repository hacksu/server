#!/bin/bash

# 

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );


source $REPO/scripts/utils/files.sh

if ! [ -x "$(command -v npm)" ]; then
    bash $REPO/scripts/setup/node.sh
fi

if ! [ -x "$(command -v pm2)" ]; then
    echo "Installing PM2";
#   create pm2 directory
    mkdir /opt/pm2
#   set permissions so all users may access it
    chmod -R 777 /opt/pm2
#   set PM2_HOME
    add_line_if_not_present /etc/environment PM2_HOME=/opt/pm2
#   refresh shell
    hash -r
#   install pm2
    npm i -g pm2
#   ensure it runs on startup
    pm2 startup
fi

#   show status
pm2 status
