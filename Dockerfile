FROM node:20.14.0 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine

COPY certs /etc/nginx/certs/

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/pettrack-frontend/browser /usr/share/nginx/html

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
