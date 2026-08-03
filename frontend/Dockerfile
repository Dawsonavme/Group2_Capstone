FROM node:22 AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# ---- Serve stage ----
FROM nginx:alpine

COPY --from=build /app/dist/driver-safety-tabs/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80