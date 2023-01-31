FROM node:16.19.0-alpine AS builder
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build

FROM nginx:alpine
COPY --from=builder /app/nginx.conf /etc/nginx/templates/default.conf.conf
COPY --from=builder /app/dist/task /usr/share/nginx/html

EXPOSE 80