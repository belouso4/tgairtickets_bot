FROM node:20.14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

ENV PORT=3002

EXPOSE $PORT