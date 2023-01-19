#!/bin/bash

# Environment Variables
CWD=$( pwd );
REPO=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && git rev-parse --show-toplevel );

if ! [ -x "$(command -v zsh)" ]; then
    echo "Installing ZSH";
    source $REPO/scripts/setup/env.sh
#   fetch package registry
    sudo apt update -y
#   install zsh
    sudo apt install -y zsh
#   install oh-my-zsh
    yes y | sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
    chsh -s /bin/zsh root
fi

echo "ZSH is set up";
# get node version
echo "- zsh $(zsh --version)"
