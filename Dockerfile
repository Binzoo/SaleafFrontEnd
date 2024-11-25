# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Enable Corepack and install Yarn
RUN corepack enable
RUN corepack prepare yarn@4.1.0 --activate

# Copy the entire project
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Build the application
RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Set default PORT if not provided
ARG PORT=80
ENV PORT=$PORT

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port
EXPOSE $PORT

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
