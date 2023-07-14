FROM node:18-alpine

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

RUN npx prisma generate

RUN npm run build

CMD ["node", "dist/main.js"]