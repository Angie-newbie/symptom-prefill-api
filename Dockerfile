FROM node:18-alpine


# Set working directory
WORKDIR /app


# Copy package files
COPY package.json package-lock.json package*.json LICENSE README.md ./
COPY src ./src/

RUN npm install

# Set environment variable (development by default)
ENV NODE_ENV=development

# Expose port
EXPOSE 3000


CMD ["npm", "run", "dev"]