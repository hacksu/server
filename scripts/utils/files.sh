#!/bin/bash

function add_line_if_not_present {
    file="$1";
    shift;
    line="$@";
    grep -qxF "$line" $file || echo $line >> $file
}
