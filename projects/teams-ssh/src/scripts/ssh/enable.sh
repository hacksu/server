#!/usr/bin/env bash

USER=$1

id "$USER" &>/dev/null
if [ "$?" -eq "0" ]; then
    echo "user $USER already exists"
else
    echo "creating user $USER"
    adduser --disabled-password --force-badname --home /home/$USER --shell /bin/zsh --gecos "" $USER
    passwd -d $USER
    mkdir /home/$USER/.ssh
    chown -R $USER /home/$USER
    chmod 0700 /home/$USER/.ssh
    cd /home/$USER && yes y | sudo -H -u $USER sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"; cd --
    echo "user $USER has been created"
fi

if [[ -p /dev/stdin ]]; then
    PIPE=$(cat -)
    echo $PIPE > /home/$USER/.ssh/authorized_keys
    chown -R $USER /home/$USER
    chmod 0700 /home/$USER/.ssh
fi
