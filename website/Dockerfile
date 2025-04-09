FROM node:20.17-alpine3.19 AS builder

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
# COPY babel.config.js ./babel.config.js
COPY jest.config.ts ./jest.config.ts
COPY jest.setup.ts ./jest.setup.ts

# Install dependencies
RUN npm install

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GO_API_URL
ENV NEXT_PUBLIC_GO_API_URL=$NEXT_PUBLIC_GO_API_URL
ARG NEXT_PUBLIC_S3_BUCKET1
ARG NEXT_PUBLIC_S3_BUCKET2
ARG NEXT_PUBLIC_S3_BUCKET3
ENV NEXT_PUBLIC_S3_BUCKET1=$NEXT_PUBLIC_S3_BUCKET1
ENV NEXT_PUBLIC_S3_BUCKET2=$NEXT_PUBLIC_S3_BUCKET2
ENV NEXT_PUBLIC_S3_BUCKET3=$NEXT_PUBLIC_S3_BUCKET3

ENV NODE_ENV=production

RUN npm run build \
    && ls -l /app

# RUN npm run build

# Run tests
# FROM builder AS test
# RUN npm install --only=dev
# RUN npm test

# production stage
FROM node:20.17-alpine3.19 AS production

# # Copy the dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/src ./src
# COPY --from=builder /app/.next /usr/share/nginx/html
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

WORKDIR /app

# # Install only production dependencies
# # RUN npm install --only=production

# # Set the default environment to production
ENV NODE_ENV=production
ENV TZ=Asia/Bangkok

EXPOSE 3000

CMD ["npm", "run", "start"]