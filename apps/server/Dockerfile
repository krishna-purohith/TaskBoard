FROM node:22-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY turbo.json ./

COPY apps/server/package.json ./apps/server/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/typescript-config/package.json ./packages/typescript-config/

RUN pnpm install --frozen-lockfile

COPY apps/server ./apps/server
COPY packages/db ./packages/db
COPY packages/types ./packages/types
COPY packages/typescript-config ./packages/typescript-config

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm turbo build --filter=server

WORKDIR /app/apps/server

EXPOSE 8080

CMD ["node", "dist/index.js"]