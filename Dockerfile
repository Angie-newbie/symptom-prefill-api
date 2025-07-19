FROM node:18-alpine

# Inside the container, create and use a folder called /app as the working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json package*.json tsconfig.json LICENSE README.md ./
COPY src ./src/

RUN npm install

# Set environment variable (development by default)
ENV NODE_ENV=development

# Expose port
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider --quiet http://localhost:3000/health || exit 1

CMD ["npm", "run", "dev"]