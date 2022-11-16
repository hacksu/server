#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

if [ -x "$(command -v node)" ]; then
    echo "Node.js $(node -v) is already installed";
else
    echo "Installing Node.js & NPM";
    source $REPO/scripts/setup/env.sh
#   fetch package registry
    sudo apt update -y
#   install node & npm
    sudo apt install -y nodejs npm
#   install n to allow us to easily swap between nodejs versions
    npm install --global n
#   swap to node v18
    n 18
#   swap to new bash to ensure we have proper version
    exec bash
#   install yarn
    npm install --global yarn@1.x
fi
