FROM node:lts

WORKDIR /usr/src/app

RUN npm install -g @angular/cli

COPY package*.json ./

CMD ["sh", "-c", "npm install && ng serve --host 0.0.0.0"]