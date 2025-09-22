# sBTC Bridge

## Getting Started

Clone sBTC and run the dev env, this runs a devnet deployment of stacks and a regtest deployment of bitcoin and installs and runs sBTC against them
Must have [docker](https://docs.docker.com/get-started/get-docker/) installed
```
git clone https://github.com/stacks-sbtc/sbtc.git
cd sbtc
make devenv-up
```

Install dependencies and run the development server:

```bash
cp .env.sample .env
yarn && yarn dev
```

The development server will be running at [http://localhost:3000](http://localhost:3000)

## Feature flags

Some feature flags must be set at build time, so if you are building the image with docker and you want some specific feature flags you must pass them also when building to ensure they are in effect

Currently supported flags are:

- `reskin`: is for the bridge reskin that can be accessed at /reskin

These flags can be enabled in the .env file comma separated values style like so:

```bash
FEATURE_FLAGS=reskin,feature1,feature2
```

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

## GitHub Actions CI/CD

This project includes GitHub Actions workflows for automated building and publishing to AWS ECR.

### Build Workflow (`.github/workflows/docker-build.yml`)

Automatically builds and pushes Docker images to Amazon ECR on push to `environment/*`.
Create environments for each environment branch (e.g. `environment/private-mainnet`, `environment/mainnet`)

**Required GitHub Secrets:**
- `AWS_ROLE_ARN`: ARN of the AWS role for ECR access

**Required GitHub Variables:**
- `AWS_REGION`: AWS region (e.g., `eu-west-1`)
- `AWS_ECR`: ECR repository name (e.g., `sbtc-bridge`)

### Setup Instructions

1. **Configure AWS IAM Role:**
   - Create an IAM role with ECR
   - Configure OIDC trust relationship for GitHub Actions
   - Add the role ARN as `AWS_ROLE_ARN` secret

2. **Set up GitHub Variables:**
   - Go to repository Settings → Secrets and variables → Actions
   - Add the required variables listed above

### Image Tags

The build workflow creates the following image tags:
- `sbtc-bridge-{branch}`: Branch-specific tag
- `sbtc-bridge-{commit-sha}`: Commit-specific tag
- `sbtc-bridge-latest`: Latest tag (only on main branch)