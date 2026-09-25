# Builds the prerendered static site and serves it with nginx, proxying /api to the backend
# container (see docker-compose.yml). For most hosting (Netlify, Vercel, S3+CloudFront, GitHub
# Pages) you don't need this file at all — just run `pnpm build` and upload the `dist/` folder;
# see README.md > Deployment.
FROM node:22-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_SITE_URL
ARG VITE_GOOGLE_SITE_VERIFICATION
ARG VITE_PUBLIC_EMAIL
ENV VITE_SITE_URL=${VITE_SITE_URL} \
    VITE_GOOGLE_SITE_VERIFICATION=${VITE_GOOGLE_SITE_VERIFICATION} \
    VITE_PUBLIC_EMAIL=${VITE_PUBLIC_EMAIL}
RUN pnpm build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
