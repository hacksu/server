#!/usr/bin/env bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

cd $REPO/projects/teams-ssh
bash $REPO/scripts/setup/pm2.sh

export PM2_HOME=/opt/pm2
export pm2_home=/opt/pm2 
npm run test && pm2 start --name teams-ssh "npm run start" && pm2 save



