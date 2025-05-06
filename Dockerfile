FROM node:23-alpine AS pnpm

RUN apk update && apk add git

COPY ./package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN corepack enable
RUN corepack install

FROM pnpm AS development-dependencies-env
COPY . /app/
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM pnpm AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
RUN pnpm run build

FROM busybox

# Copy the build files to the output folder (volumed in) to be consumed by the webserver
COPY --from=build-env /app/dist /app/dist
RUN mkdir -p /build/out
CMD cp -r /app/dist/* /build/out/
