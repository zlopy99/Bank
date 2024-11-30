FROM node:20.9.0 as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @angular/cli && npm install

COPY . /usr/src/app

CMD ["ng", "serve", "--host", "0.0.0.0"]