# --- base ---
FROM node:16.14-alpine AS pnpm

RUN --mount=type=cache,target=/var/cache/apk \
  apk add --no-cache bash
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  npm install -g pnpm@6.32.1


# --- lib cli ---
FROM pnpm AS build_cli

WORKDIR /app

COPY ./package.json ./turbo.json ./pnpm-lock.yaml ./pnpm-workspace.yaml /app/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm fetch

COPY ./code/packages/lib/package.json /app/code/packages/lib/package.json
COPY ./code/apps/api/package.json /app/code/apps/api/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm i -r --offline

COPY ./code/tsconfig.json /app/code/
COPY ./code/.bin/ /app/code/.bin/

COPY ./code/packages/lib/ /app/code/packages/lib/
COPY ./code/apps/api/ /app/code/apps/api/


RUN cd /app && pnpm run build
RUN cd /app/code/apps/api && pnpm run generate:env:more


# --- api ---
FROM pnpm

WORKDIR /app

COPY ./package.json ./turbo.json ./pnpm-lock.yaml ./pnpm-workspace.yaml /app/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm fetch --prod

COPY ./code/packages/lib/package.json /app/code/packages/lib/package.json
COPY ./code/apps/api/package.json /app/code/apps/api/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm i -r --offline --prod

COPY --from=build_cli /app/code/packages/lib/dist/ /app/code/packages/lib/dist/
COPY --from=build_cli /app/code/apps/api/dist/ /app/code/apps/api/dist/
COPY --from=build_cli /app/code/apps/api/.env /app/code/apps/api/.env
COPY ./code/apps/api/.bin/ /app/code/apps/api/.bin/

WORKDIR /app/code/apps/api

CMD ["./.bin/tools.sh", "runProd"]
