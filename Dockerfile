# Stage 1: Build
FROM node:22 AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./

# Vite inlines VITE_* at build time, so they must be build args (a runtime
# container variable has no effect on the built files). .env files are not in
# the build context (.dockerignore). Changing an arg invalidates the cache here.
ARG VITE_API_URL
ARG VITE_SITE_URL
ENV VITE_API_URL=$VITE_API_URL     VITE_SITE_URL=$VITE_SITE_URL
RUN yarn build

# Stage 2: Serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80