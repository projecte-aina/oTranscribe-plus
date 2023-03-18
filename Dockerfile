FROM node:latest as dist

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN make build_prod

FROM nginx

COPY --from=dist /app/dist /usr/share/nginx/html