# --- base ---

FROM --platform=linux/amd64 node:16.14-alpine AS pnpm

RUN apk add --no-cache bash
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  npm install -g pnpm@6.32.1


# --- lib cli ---
FROM pnpm AS build_cli_lib

WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
COPY ./pnpm-lock.yaml ./pnpm-workspace.yaml /app/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm fetch

COPY ./code/lib/package.json /app/code/lib/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm -r install --frozen-lockfile --offline

COPY ./code/tsconfig.json /app/code/tsconfig.json

COPY ./code/lib/ /app/code/lib/

RUN cd /app/code/lib && pnpm build

# --- api cli ---
# https://github.com/pnpm/pnpm/issues/3114

FROM pnpm AS build_cli

WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
COPY ./pnpm-lock.yaml ./pnpm-workspace.yaml /app/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm fetch

COPY ./code/lib/package.json /app/code/lib/package.json
COPY ./code/lib/.bin/ /app/code/lib/.bin/
COPY --from=build_cli_lib /app/code/lib/dist/ /app/code/lib/dist/

COPY ./code/api/package.json /app/code/api/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm -r install --frozen-lockfile --offline

COPY ./code/api/prisma/ /app/code/api/prisma/
RUN cd /app/code/api && pnpm generate:prisma

COPY ./code/tsconfig.json /app/code/tsconfig.json

COPY ./code/api/ /app/code/api/

RUN cd /app/code/api && pnpm build:prod

ARG _gitShortVer
ARG _gitTime
ENV _gitShortVer=${_gitShortVer:-"-"} \
  _gitTime=${_gitTime:-"-"}

RUN cd /app/code/api && yarn generate:env:more

# --- api ---

FROM pnpm

WORKDIR /app

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
COPY ./pnpm-lock.yaml ./pnpm-workspace.yaml /app/
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm fetch --prod

COPY ./code/lib/package.json /app/code/lib/package.json
COPY ./code/lib/.bin/ /app/code/lib/.bin/
COPY --from=build_cli_lib /app/code/lib/dist/ /app/code/lib/dist/

COPY ./code/api/package.json /app/code/api/package.json

RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm -r install --frozen-lockfile --offline --prod

COPY ./code/api/prisma/ /app/code/api/prisma/
RUN cd /app/code/api && pnpm generate:prisma

COPY --from=build_cli /app/code/api/.env /app/code/api/.env
COPY --from=build_cli /app/code/api/src/_env.json /app/code/api/src/_env.json
COPY --from=build_cli /app/code/api/.bin/tools.sh /app/code/api/.bin/tools.sh

COPY --from=build_cli /app/code/api/dist/ /app/code/api/dist/

WORKDIR /app/code/api

CMD ["./.bin/tools.sh", "runProd"]
