#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

bash $REPO/scripts/setup/pm2.sh
bash $REPO/scripts/setup/snap.sh
bash $REPO/scripts/setup/nginx.sh
bash $REPO/scripts/setup/mongodb.sh

pm2 status
systemctl status nginx
systemctl status mongodb

bash $REPO/scripts/setup/zsh.sh
zsh
