FROM node:18-alpine

WORKDIR /app


# Copy package files
COPY package*.json ./

RUN npm install

COPY . .

# Set environment variable (development by default)
ENV NODE_ENV=development

# Expose port
EXPOSE 3000


CMD ["npm", "run", "dev"]