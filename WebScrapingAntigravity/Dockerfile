FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build application
RUN npx prisma generate
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
