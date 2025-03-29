# Use a Node.js base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the necessary ports
EXPOSE 19000 19001 19002

# Start the Expo server in tunnel mode
CMD ["expo", "start", "--tunnel"]