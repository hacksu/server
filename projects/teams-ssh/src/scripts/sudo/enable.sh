#!/usr/bin/env bash

USER=$1

# Add user to sudo
usermod -aG sudo $USER