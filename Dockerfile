# Stage 1: builder
FROM node:22-alpine AS builder
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend .
RUN npx prisma generate
RUN npm run build

# Stage 2: runner
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8080
CMD ["npm", "run", "start"]
