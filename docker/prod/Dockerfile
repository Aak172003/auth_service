# whenever we are tyring to build docker image for production , we use multi-build process
FROM node:18-alpine as builder

WORKDIR /app

# Copy package.json file into /usr/src/app/ (./ -> current Directory )                                     
COPY package*.json ./

RUN npm ci

# Copy the rest of our project file system into the container
COPY . .


RUN npm run build

# At step 1 dist foler will generate
# 2nd step 
FROM node:18-alpine as production

ENV NODE_ENV=production


WORKDIR /app

# Copy package.json file into /usr/src/app/ (./ -> current Directory )                                     
COPY package*.json ./

# this will goona ignore , dev-dependencies 
RUN npm ci --ignore-scripts


COPY --from=builder /app/dist ./

EXPOSE 5500

# This command will goona execute we i run container
CMD [ "node", "src/server.js" ]



















