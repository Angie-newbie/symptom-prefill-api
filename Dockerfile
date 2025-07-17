FROM alpine:latest

WORKDIR /app


# Copy package files
COPY package*.json ./

RUN npm install

COPY . .



CMD ["npm", "run", "dev"]