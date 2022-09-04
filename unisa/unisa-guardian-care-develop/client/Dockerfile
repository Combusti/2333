FROM node:18-alpine

WORKDIR /usr/src/app/client

COPY package*.json ./

RUN npm install -g @angular/cli @angular-devkit/build-angular && npm install

USER node

EXPOSE 4200

CMD ["npm", "start"]