#!/bin/bash

# Environment Variables
CWD=$( pwd );
SWD=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd );


source $SWD/../utils/files.sh


add_line_if_not_present $CWD/hi.txt hey there!