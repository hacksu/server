#!/usr/bin/env bash

USER=$1

if id "$USER" &>/dev/null; then
    rm -rf /home/$USER/.ssh/authorized_keys
fi
