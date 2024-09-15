# Use an official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY ./app/package*.json /app

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY ./app /app

# Expose the port the app runs on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]