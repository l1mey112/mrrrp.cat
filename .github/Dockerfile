FROM docker.io/library/nginx:1.29

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx-module-njs make rsync \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

LABEL org.opencontainers.image.source=https://github.com/l1mey112/mrrrp.cat
EXPOSE 8080
