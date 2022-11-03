FROM node:18-alpine AS base
RUN apk update && apk add --no-cache libc6-compat git
WORKDIR /app

FROM base AS pruner
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@cz3/app --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS builder
COPY .gitignore .gitignore
COPY --from=pruner /app/.yarn/releases/ ./.yarn/releases/
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
RUN yarn install
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run web-build --filter=@cz3/app

FROM nginx:stable-alpine AS runner
COPY --from=builder /app/app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
