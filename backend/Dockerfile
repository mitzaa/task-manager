
# Use an official Node runtime as the parent image
FROM node:14

RUN apt-get update && apt-get install -y curl unzip && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the content of the local src directory to the working directory
COPY . .

# COPY ~/.aws/ /root/.aws/


# Expose port 3001 for the backend
EXPOSE 3001

# Specify the command to run on container start
CMD ["npm", "start"]
