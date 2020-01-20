FROM node:12.14.1

WORKDIR /src

COPY package.json .

RUN npm install
