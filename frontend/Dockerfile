# Çok aşamalı: Vite build → nginx ile statik servis
FROM node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# API aynı origin'den /api altında (Caddy /api'yi strip edip backend'e verir)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine@sha256:d565d19ef132a5834f5897f602831ad2e40a36c26c625f2f94f9b3fdf0ed292d
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
