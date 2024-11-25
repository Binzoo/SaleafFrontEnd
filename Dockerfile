# Stage 1: Build the application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package manager files
COPY package.json yarn.lock .yarnrc.yml ./

# Copy the rest of the application code
COPY . .

# Enable Corepack (included by default in Node.js 16.9+)
RUN corepack enable

# Prepare and activate Yarn 4.1.0
RUN corepack prepare yarn@4.1.0 --activate

# Install dependencies using Yarn 4.1.0
RUN yarn install --frozen-lockfile

# Build the application
RUN yarn build

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
