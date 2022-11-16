#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

bash $REPO/scripts/setup/pm2.sh
bash $REPO/scripts/setup/nginx.sh