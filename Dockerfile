# Use a Node.js base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application for production
RUN npm run build

# Use a smaller, production-ready image
FROM node:18-alpine AS runner

WORKDIR /app

# Copy the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose port 3000
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production

# Start the Next.js application
CMD ["npm", "start"]