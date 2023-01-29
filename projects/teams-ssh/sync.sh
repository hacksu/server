#!/bin/bash

REPO_LOCAL_HASH=$(git rev-parse HEAD);
REPO_REMOTE_HASH=$(git ls-remote origin -h refs/heads/main | cut -f1);

if [ "$REPO_LOCAL_HASH" != "$REPO_REMOTE_HASH" ]; then
    echo "Need to update $REPO_LOCAL_HASH $REPO_REMOTE_HASH";
    git fetch
    git pull
    pm2 restart teams-ssh
fi

exit 0