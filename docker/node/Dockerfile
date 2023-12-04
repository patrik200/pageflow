FROM node:16-slim

RUN apt update

RUN apt install git python make g++ gcc procps curl wget unzip cmake git-crypt rsync nginx -y
RUN apt install build-essential -y

WORKDIR /app

COPY ./docker/scripts ./

COPY package.json package-lock.json ./
COPY packages/builder/package.json ./packages/builder/
COPY packages/kit/package.json ./packages/kit/
COPY packages/shared-enums/package.json ./packages/shared-enums/
COPY packages/back/core-config/package.json ./packages/back/core-config/
COPY packages/back/back-kit/package.json ./packages/back/back-kit/
COPY packages/back/backend/package.json ./packages/back/backend/
COPY packages/front/landing/package.json ./packages/front/landing/
COPY packages/front/email-templates/package.json ./packages/front/email-templates/
COPY packages/front/next/package.json ./packages/front/next/
COPY packages/front/ui-kit/package.json ./packages/front/ui-kit/
COPY packages/front/front-kit/package.json ./packages/front/front-kit/
COPY packages/front/frontend/package.json ./packages/front/frontend/

RUN npm run local-install

COPY . ./

COPY ./docker/nginx /etc/nginx/

RUN ./full-build.sh

CMD ./cnly.sh -n 'nginx,app' 'service nginx start' './full-start.sh'
