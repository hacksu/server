#!/bin/bash

docker build . && docker run --rm -it --entrypoint /bin/bash  $(docker build -q .)

