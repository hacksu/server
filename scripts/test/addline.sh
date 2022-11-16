#!/bin/bash

# Environment Variables
CWD=$( pwd );
SWD=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd );


source $SWD/../utils/files.sh


add_line_if_not_present $CWD/hi.txt hey there!
add_line_if_not_present /etc/environment PM2_HOME=/opt/pm2