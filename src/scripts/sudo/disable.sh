#!/usr/bin/env bash

USER=$1

# Remove user from sudo
deluser $USER sudo