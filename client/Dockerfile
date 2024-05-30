FROM node:16

WORKDIR /

# COPY package*.json ./
# COPY ./public ./public
COPY . .

RUN npm install
RUN npx react-scripts build

EXPOSE 8081

CMD ["npx", "serve", "-p", "8081", "-s", "build"]