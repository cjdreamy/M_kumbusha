# Step 1: Build the React application
FROM node:20-alpine AS build

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
# We copy both lockfiles just in case, but pnpm-lock.yaml is preferred
COPY package.json pnpm-lock.yaml* package-lock.json* ./

# Install dependencies
RUN if [ -f pnpm-lock.yaml ]; then pnpm install; \
    else npm install; \
    fi

# Copy the rest of the application
COPY . .

# Build the app
# Vite requires environment variables to be present during build time 
# to embed them into the production bundle.
# Render automatically provides your Environment Variables during the Docker build.
RUN npx vite build

# Step 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
