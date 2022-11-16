#!/bin/bash

# Ensure needsrestart is set to automatic
# https://stackoverflow.com/questions/73397110/how-to-stop-ubuntu-pop-up-daemons-using-outdated-libraries-when-using-apt-to-i
sed -i "/#\$nrconf{restart} = 'i';/c\$nrconf{restart} = 'a';" /etc/needrestart/needrestart.conf;
