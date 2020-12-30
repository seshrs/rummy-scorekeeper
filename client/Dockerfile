# Specify a base image
FROM node:14-alpine

WORKDIR /app

# Install dependencies
COPY package.json .
RUN yarn install 
COPY . .

# Default command
CMD ["yarn", "start"]