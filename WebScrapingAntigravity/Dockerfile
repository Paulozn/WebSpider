FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

# Copia as definições de pacotes primeiro para cache do Docker
COPY package*.json ./
RUN npm install

# Copia todo o código fonte para dentro do container
COPY . .

# ACEITA AS VARIÁVEIS DO EASYPANEL DURANTE O BUILD (CORREÇÃO PRISMA)
ARG DATABASE_URL
ARG JWT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET

# Build da aplicação Next.js e Prisma Client
RUN npx prisma generate
RUN npm run build

# Libera a porta 3000 (Next.js default)
EXPOSE 3000

# Comando para iniciar o servidor de produção
CMD ["npm", "start"]
