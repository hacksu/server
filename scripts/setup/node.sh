#!/bin/bash

# Environment Variables
CWD=$( pwd );
SWD=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd );

if [ -x "$(command -v node)" ]; then
    echo "Node.js $(node -v) is already installed";
else
    echo "Installing Node.js & NPM";
#   fetch package registry
    DEBIAN_FRONTEND=noninteractive sudo apt update -y
#   install node & npm
    DEBIAN_FRONTEND=noninteractive sudo apt install -y nodejs npm
#   install n to allow us to easily swap between nodejs versions
    npm install --global n
#   swap to node v18
    n 18
#   swap to new bash to ensure we have proper version
    exec bash
#   install yarn
    npm install --global yarn@1.x
fi
