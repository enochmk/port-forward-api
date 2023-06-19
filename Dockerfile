# official node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY ["package*.json", "."]

# Install dependencies
RUN npm install

# Copy the rest of the files
COPY ["build", "."]

# Expose port
EXPOSE 6006

# Run the app
CMD ["node", "src/index.js"]