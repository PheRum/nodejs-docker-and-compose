FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund --omit=dev
COPY . ./
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
