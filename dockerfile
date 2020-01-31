FROM node:12.13.1

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

ENV LOLOG_BACKEND=http://lolog-backend:4000

CMD ["yarn", "production"]