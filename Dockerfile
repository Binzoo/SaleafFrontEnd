# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Enable Corepack (included by default in Node.js 16.9+)
RUN corepack enable

# Prepare and activate Yarn 4.1.0
RUN corepack prepare yarn@4.1.0 --activate

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies using Yarn 4.1.0
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy custom Nginx configuration for SPA routing
# Uncomment and modify if using client-side routing (e.g., React Router)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
