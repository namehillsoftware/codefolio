FROM node:20.8.0

WORKDIR /src

COPY package.json .

RUN npm install
