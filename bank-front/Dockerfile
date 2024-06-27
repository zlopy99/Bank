# FROM node:20.9.0
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm install -g @angular/cli
# RUN ng build --configuration production
# EXPOSE 4200
# CMD ["npm", "start"]

FROM node:20.9.0 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist/bank /usr/share/nginx/html