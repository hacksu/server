#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

if ! [ -x "$(command -v nginx)" ]; then
    echo "Installing NGINX";
    source $REPO/scripts/setup/env.sh
#   fetch package registry
    sudo apt update -y
#   install node & npm
    sudo apt install -y nginx
#   allow it through firewall
    ufw allow "Nginx Full"
#   enable firewall
    ufw --force enable
#   firewall status
    ufw status
fi

# get nginx status
systemctl status nginx