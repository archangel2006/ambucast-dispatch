# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL deps (including dev for tsc)
COPY package*.json ./
RUN npm install

# Copy prisma schema and generate the client
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npx prisma generate

# Copy source and compile TypeScript
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output and generated Prisma client from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Expose the port (default 3001, overridable via PORT env)
EXPOSE 3001

# prestart runs prisma migrate deploy automatically (defined in package.json)
CMD ["npm", "start"]
