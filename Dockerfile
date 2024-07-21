# Use the official Node.js image as a base image
FROM node:22-alpine

# Create and set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .


RUN npm install -g pm2

# Copy PM2 ecosystem file
COPY ecosystem.config.js .

# Expose the port the app runs on (if necessary)
EXPOSE 3000

# Build the NestJS application
RUN npm run build

# Start the application with PM2 using ecosystem file
# To this:
CMD ["pm2-runtime", "start", "ecosystem.config.js"]