#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

if ! [ -x "$(command -v node)" ]; then
    echo "Installing Node.js & NPM";
    source $REPO/scripts/setup/env.sh
#   fetch package registry
    sudo apt update -y
#   install node & npm
    sudo apt install -y nodejs npm
#   upgrade npm
    npm install -g npm@9
#   install n to allow us to easily swap between nodejs versions
    echo "Upgrading Node.js Version";
    npm install --global n
#   swap to stable node (v18.13.0 as of 1/18/23)
    n stable
#   refresh shell
    hash -r
#   install yarn
    echo "Installing Yarn v1";
    npm install --global yarn@1
fi

echo "Node.js is set up";
# get node version
echo "- node $(node -v)"
# get npm version
echo "- npm $(npm -v)"
# get yarn version
echo "- yarn $(yarn -v)"
