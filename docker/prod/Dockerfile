# Use Multi-Step build systems
# Alpine is a ligher weight version of nodejs 18
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json file into app/ (./ -> current Directory )                                     
COPY package*.json ./

# install dependencies
# here ci means install only those dependencies which mention in package.json file with the same version
RUN npm ci

# Copy the rest of our app's source code into the container
COPY . .

RUN npm run build

# Till now we perform build , so this will create dist folder


# Second
FROM node:18-alpine AS production

# because of this this will only dependencies not install dev-dependencies
# due to this out image size will automatically reduce
ENV NODE_ENV=production

WORKDIR /app

# Copy package.json file into app/ (./ -> current Directory )                                     
COPY package*.json ./


RUN npm ci --ignore-scripts

# if step one execute , so this will create dist folder we are copy only dist folder form app
COPY --from=builder /app/dist ./


EXPOSE 5500

# this run only when we start container 
CMD [ "node" , "src/server.js" ]













