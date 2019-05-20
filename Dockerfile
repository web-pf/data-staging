FROM node:12-alpine
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN cnpm i
RUN cnpm i -g ts-node typescript

EXPOSE 9000
WORKDIR /app