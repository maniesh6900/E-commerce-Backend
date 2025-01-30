FROM node:alpine
WORKDIR /app/practice/server
COPY . /app/practice/server
RUN npm install
CMD node index.js