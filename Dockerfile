FROM node:14

WORKDIR /app

COPY . .

RUN npm install -g @angular/cli@12.2.12

RUN npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
