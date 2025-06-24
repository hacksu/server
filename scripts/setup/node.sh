#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

if ! [ -x "$(command -v node)" ]; then
    echo "Installing Node.js & NPM";
    source $REPO/scripts/setup/env.sh
#   fetch package registry
    sudo apt update -y
    # install nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
    # install LTS node
    nvm install --lts
    # use LTS node
    nvm use --lts
fi

echo "Node.js is set up";
# get node version
echo "- node $(node -v)"
# get npm version
echo "- npm $(npm -v)"
