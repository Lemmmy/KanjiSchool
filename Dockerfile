FROM node:16.17

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
RUN yarn global add rimraf @craco/craco@^6.1.2
RUN yarn install

COPY . .
ENV NODE_ENV=production
RUN yarn run build
RUN yarn run optimise

RUN mkdir out
CMD cp -r build/* out/
