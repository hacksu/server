#!/usr/bin/env bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

bash $REPO/scripts/setup/pm2.sh

pm2 start --name teams-ssh "npm run start"
pm2 save

