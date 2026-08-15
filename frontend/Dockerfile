FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy app
COPY . .

# Build
RUN npm run build

# Serve with a simple HTTP server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "5173"]
