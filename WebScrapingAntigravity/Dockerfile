FROM mcr.microsoft.com/playwright:v1.58.2-noble
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG DATABASE_URL
ARG JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET

# GERA O CLIENTE, CRIA AS TABELAS E FAZ O BUILD
RUN npx prisma generate
RUN npx prisma db push --accept-data-loss
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
