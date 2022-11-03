FROM node:18-alpine AS base
RUN apk update && apk add --no-cache libc6-compat git

RUN npm i -g turbo

FROM base as pruner
WORKDIR /cz3
COPY . .
RUN turbo prune --scope=@cz3/app --docker

FROM base AS installer
WORKDIR /cz3
COPY --from=pruner /cz3/out/json/ .
COPY --from=pruner /cz3/out/yarn.lock ./yarn.lock
RUN yarn install

FROM base as builder
WORKDIR /cz3
COPY --from=pruner /cz3/.git ./.git
COPY --from=pruner /cz3/out/full/ .
COPY --from=installer /cz3/ .
RUN turbo run web-build --scope=@cz3/app

FROM nginx:stable-alpine AS runner
COPY --from=builder /cz3/app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
