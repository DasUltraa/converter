FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    ffmpeg \
    fonts-dejavu \
    fonts-liberation \
    fontconfig \
    imagemagick \
    libreoffice \
    pandoc \
    p7zip-full \
    poppler-utils \
  && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /tmp/kuglers-converter \
  && chown -R nextjs:nodejs /tmp/kuglers-converter

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
