# ===== Étape 1 : builder =====
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
# Génère le client Prisma dans generated/prisma
RUN npx prisma generate
# Compile ton code NestJS dans dist/
RUN npm run build

# ===== Étape 2 : runner =====
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

# Copie package.json et node_modules (pour ne pas réinstaller)
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/package-lock.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copie le dossier compilé 'dist' et le client Prisma généré
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/generated ./generated

ENV NODE_ENV=production

CMD ["node", "dist/main"]
