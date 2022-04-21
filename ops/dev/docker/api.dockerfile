# --- base ---
FROM --platform=linux/amd64 node:16.14-alpine AS pnpm

RUN --mount=type=cache,target=/var/cache/apk \
  apk add --no-cache bash
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  npm install -g pnpm@6.32.1

# --- api ---
FROM pnpm

WORKDIR /app/code/apps/api

# for tsc performance(fs.watch)
ENV TSC_NONPOLLING_WATCHER=true

CMD ["pnpm", "dev"]
