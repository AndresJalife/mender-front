# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -g expo-cli
RUN npm install @types/react-native
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the necessary ports
EXPOSE 19000 19001 19002

# Start the Expo server in tunnel mode
CMD ["expo", "start", "--tunnel"]