FROM docker.io/library/nginx:1.29

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx-module-njs \
    && rm -rf /var/lib/apt/lists/*

COPY nginx-prod.conf /etc/nginx/nginx.conf
COPY http.conf *.js /etc/nginx/
COPY public/ /var/www/html/

LABEL org.opencontainers.image.source=https://github.com/l1mey112/mrrrp.cat
EXPOSE 8080
