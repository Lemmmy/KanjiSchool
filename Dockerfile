# Build stage
FROM node:18-alpine AS build

RUN apk update && apk add git

ARG SENTRY_DSN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_TOKEN
ARG SENTRY_URL
ENV SENTRY_DSN=$SENTRY_DSN
ENV SENTRY_ORG=$SENTRY_ORG
ENV SENTRY_PROJECT=$SENTRY_PROJECT
ENV SENTRY_TOKEN=$SENTRY_TOKEN
ENV SENTRY_URL=$SENTRY_URL

WORKDIR /build

COPY ["package.json", "yarn.lock", "./"]
RUN yarn install

COPY . .
ENV NODE_ENV=production
RUN yarn run build

# Copy the build files to the output folder (ideally volumed in) to be consumed by the webserver
FROM busybox

WORKDIR /build
COPY --from=build /build/build ./build

RUN mkdir out
CMD cp -r build/* out/
