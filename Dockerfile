FROM node:lts

WORKDIR /usr/src/app

# Install Angular CLI globally
RUN npm install -g @angular/cli

COPY package*.json ./

# Set the command
CMD ["sh", "-c", "npm install && ng serve --host 0.0.0.0"]