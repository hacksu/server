#!/bin/bash

# Environment Variables
CWD=$( pwd );
SWD=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

function add_line_if_not_present {
    file="$1";
    shift;
    line="$@";
    echo "okay, adding '$line' to $file";
    grep -qxF "$line" $file || echo $line >> $file
}
