# Build stage
FROM node:20-alpine AS build

RUN apk update && apk add git

WORKDIR /build

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install

COPY . .
ENV NODE_ENV=production
RUN yarn run build

# Copy the build files to the output folder (ideally volumed in) to be consumed by the webserver
FROM busybox

WORKDIR /build
COPY --from=build /build/dist ./dist

RUN mkdir out
CMD cp -r dist/* out/
