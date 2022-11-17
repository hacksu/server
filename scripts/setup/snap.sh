#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

if ! [ -x "$(command -v snap)" ]; then
    echo "Installing Snap";
    source $REPO/scripts/setup/env.sh
#   fetch package registry
    sudo apt update -y
#   install node & npm
    sudo apt install -y snapd
fi