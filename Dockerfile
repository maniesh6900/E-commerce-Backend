# Use the official Node.js LTS image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR src/server

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the port your server runs on (e.g., 3000)
EXPOSE 4000

# Set the command to start the server
CMD node index.js