FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the Strapi application
RUN npm run build

# Production stage
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/favicon.png ./favicon.png
COPY --from=build /app/database ./database
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/config ./config
COPY --from=build /app/.strapi ./.strapi

# Expose the port Strapi runs on
EXPOSE 1337

# Set the command to start Strapi
CMD ["npm", "run", "start"] 