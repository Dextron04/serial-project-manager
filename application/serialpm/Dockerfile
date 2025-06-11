FROM node:22.14.0-bookworm
ENV NODE_ENV=dev

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
COPY package-lock.json ./
# Install 
RUN npm install
# Bundle app source
COPY . .
# Build the app
RUN npm run build
# Expose the port the app listens on
EXPOSE 3000
# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "run", "dev"]

#Usage:
# docker build -t serialpm .
# docker run -p 3000:3000 -d serialpm