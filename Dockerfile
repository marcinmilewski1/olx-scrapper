FROM node:10.6.0
WORKDIR /app
COPY . .
RUN npm install
CMD npm run start