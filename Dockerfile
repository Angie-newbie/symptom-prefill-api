FROM node:18-alpine

# Inside the container, create and use a folder called /app as the working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json package*.json tsconfig.json LICENSE README.md ./

RUN npm install

COPY src ./src/

# Build the TypeScript code into JavaScript
RUN npm run build

# Build-time argument for DATABASE_URL
ARG DATABASE_URL=mongodb://localhost:27017/symptoms

# Set environment variable (development by default)
# ENV NODE_ENV=development
ENV DATABASE_URL=${DATABASE_URL}

# Build-time argument for PORT (fallback to 3000)
ARG PORT=3000

# Set environment variable for port (used by app at runtime)
ENV PORT=${PORT}

# Expose the port from container (makes it accessible outside)
EXPOSE ${PORT}

# Expose port
# EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider --quiet http://localhost:3000/health || exit 1

# Start the app using the compiled JavaScript
CMD ["node", "dist/index.js"]