# Use Node.js 20 Alpine
FROM node:20-alpine

# Set application directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy backend source code
COPY . .

# Backend port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]