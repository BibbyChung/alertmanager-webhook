# --- base ---
FROM node:16.14-alpine AS pnpm

RUN --mount=type=cache,target=/var/cache/apk \
  apk add --no-cache bash
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  npm install -g pnpm@6.32.1


# --- lib cli ---
FROM pnpm AS build_cli_lib

WORKDIR /app

COPY ./pnpm-lock.yaml ./pnpm-workspace.yaml /app/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm fetch

COPY ./code/packages/lib/package.json /app/code/packages/lib/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm i -r --offline

COPY ./code/tsconfig.json /app/code/tsconfig.json

COPY ./code/packages/lib/ /app/code/packages/lib/

RUN cd /app/code/packages/lib && pnpm run build


# --- api cli ---
# https://github.com/pnpm/pnpm/issues/3114
FROM pnpm AS build_cli

WORKDIR /app

COPY ./pnpm-lock.yaml ./pnpm-workspace.yaml /app/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm fetch

COPY ./code/packages/lib/package.json /app/code/packages/lib/package.json
COPY ./code/packages/lib/.bin/ /app/code/packages/lib/.bin/
COPY --from=build_cli_lib /app/code/packages/lib/dist/ /app/code/packages/lib/dist/

COPY ./code/apps/api/package.json /app/code/apps/api/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm i -r --offline

COPY ./code/tsconfig.json /app/code/tsconfig.json

COPY ./code/apps/api/ /app/code/apps/api/

RUN cd /app/code/apps/api && pnpm run build:prod

RUN cd /app/code/apps/api && pnpm run generate:env:more

# --- api ---

FROM pnpm

WORKDIR /app

COPY ./pnpm-lock.yaml ./pnpm-workspace.yaml /app/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm fetch --prod

COPY ./code/packages/lib/package.json /app/code/packages/lib/package.json
COPY ./code/packages/lib/.bin/ /app/code/packages/lib/.bin/
COPY --from=build_cli_lib /app/code/packages/lib/dist/ /app/code/packages/lib/dist/

COPY ./code/apps/api/package.json /app/code/apps/api/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm i -r --offline --prod

COPY --from=build_cli /app/code/apps/api/.env /app/code/apps/api/.env
COPY --from=build_cli /app/code/apps/api/src/_env.json /app/code/apps/api/src/_env.json
COPY --from=build_cli /app/code/apps/api/.bin/tools.sh /app/code/apps/api/.bin/tools.sh

COPY --from=build_cli /app/code/apps/api/dist/ /app/code/apps/api/dist/

WORKDIR /app/code/apps/api

CMD ["./.bin/tools.sh", "runProd"]
