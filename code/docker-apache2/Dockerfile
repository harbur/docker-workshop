FROM alpine:3.3
RUN apk --update add apache2 && rm -rf /var/cache/apk/*
RUN mkdir -p /run/apache2
EXPOSE 80
CMD httpd -D FOREGROUND
