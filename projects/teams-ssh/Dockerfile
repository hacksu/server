FROM ubuntu:focal

ARG DEBIAN_FRONTEND=noninteractive

RUN apt update -y
RUN apt install -y git curl nodejs npm openssh-server
RUN apt install -y nano

RUN hash -r
RUN npm -v
RUN npm install --global n
RUN n stable
RUN hash -r
RUN echo $(node -v)
RUN echo $(npm -v)

WORKDIR /app
COPY . .
RUN npm install

ENV TEST=test.json
COPY test.json .
COPY test .



# CMD [ "npm", "start" ]
CMD [ "node" ]