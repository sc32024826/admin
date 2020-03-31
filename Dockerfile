FROM node:13.12.0-alpine AS publish
WORKDIR /app
COPY ./ /app
RUN npm config set registry https://registry.npm.taobao.org && \
    npm install && \ 
    npm run build

FROM nginx:1.17.9-alpine
COPY --from=publish /app/dist /usr/share/nginx/html/
COPY --from=publish /app/nginx.conf /etc/nginx/nginx.conf