# Resolved from Docker Official Images registry on 2026-10-30; no mutable base tag.
FROM node:22-bookworm-slim@sha256:4b150b48b4116e2a22f2c39cc27025fbf4f153e2078fd3b14d159fdb5c7279da
RUN apt-get update && apt-get install -y --no-install-recommends python3 git ca-certificates \
    && ln -s /usr/bin/python3 /usr/local/bin/python
WORKDIR /opt/deps
COPY project/package.json project/package-lock.json ./
# Network allowed only while preparing dependencies; no project lifecycle scripts.
RUN npm ci --ignore-scripts --no-audit --no-fund
WORKDIR /opt/harness
COPY harness/package.json harness/package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY harness/sandbox.py harness/contact-controller.test.cjs ./
RUN node -e "const v=process.versions.node.split('.').map(Number);if(v[0]!==22||v[1]<19)process.exit(1)"
WORKDIR /scratch
USER 10001:10001
