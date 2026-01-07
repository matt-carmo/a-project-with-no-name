# Stage 1: builder
FROM node:22-alpine AS builder
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend .
COPY .env ./

# For build: use dummy, for production Railway will inject the real one
# ENV DATABASE_URL=${DATABASE_URL:-"postgresql://dummy:dummy@localhost:5432/dummy"}

RUN npx prisma generate
RUN npm run build

# Stage 2: runner
FROM node:22-alpine AS runner
WORKDIR /app

# Copy built artifacts
# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts



# Railway will inject DATABASE_URL at runtime
EXPOSE 8080
CMD ["npm", "run", "start"]