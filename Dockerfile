FROM node:18 AS builder

WORKDIR /code

# docker build --build-arg GIT_COMMIT=$(git rev-parse HEAD) --build-arg FEATURE_FLAGS=withdrawals,reskin
ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT
ARG FEATURE_FLAGS
ENV FEATURE_FLAGS=$FEATURE_FLAGS

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ENV NEXT_TELEMETRY_DISABLED="1"
RUN npm run build

FROM node:18

WORKDIR /app

ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

COPY --from=builder /code/node_modules ./node_modules
COPY --from=builder /code/public ./public
COPY --from=builder /code/.next ./.next
COPY --from=builder /code/package.json .

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED="1"
CMD ["npm", "start"]
