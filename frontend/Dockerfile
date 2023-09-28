# Use the official Node.js image as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# COPY ~/.aws/ /root/.aws/

# Install the React app dependencies
RUN npm install

RUN apt-get update && apt-get install -y curl unzip

# Copy the React app files to the container
COPY . .

# Specify that the app listens on port 3000
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]


