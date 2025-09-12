FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

# Bundle app source
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 3000

# Start the application (use secure version)
CMD ["node", "index-secure.js"]