FROM node:16

WORKDIR /

COPY package*.json ./
COPY .env ./

RUN npm install

COPY ./src ./src

EXPOSE 8080

CMD ["npx", "ts-node", "src/index.ts"]