FROM node:18

WORKDIR /app

COPY package.json .

COPY tsconfig.json .

RUN npm install

COPY . .

RUN npm run schema:build

CMD [ "npm", "start"]
