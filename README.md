# sBTC Bridge

## Getting Started

Install dependencies and run the development server:

```bash
cp .env.example .env
yarn && yarn dev
```

The development server will be running at [http://localhost:3000](http://localhost:3000)


## Learn More

To learn more about sBTC please visit the [sBTC Bridge Documentation](https://docs.stacks.co/concepts/sbtc).


## Git commit ID for health endpoint

To push the Git Commit version during the building phase you have to build the image passing the $GIT_COMMIT value:

```bash
export GIT_COMMIT=$(git rev-parse HEAD)

docker build --build-arg GIT_COMMIT=$GIT_COMMIT
```

or passing through the docker compose file:

```yaml
sbtc-bridge:
    restart: on-failure
    build:
      context: ./sbtc-bridge
      dockerfile: Dockerfile
      args:
        GIT_COMMIT: ${GIT_COMMIT}
```
