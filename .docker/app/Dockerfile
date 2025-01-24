FROM node:20-alpine AS dev

ARG PORT=3000

RUN apk add curl
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm install
COPY . .

ENV PORT=${PORT:-3000}
ENV NODE_ENV=dev

EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start:dev"]

#############################################

FROM node:20-alpine AS prod

ARG PORT=3000

RUN apk add curl
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .

ENV PORT=${PORT:-3000}
ENV NODE_ENV=prod

EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start"]
