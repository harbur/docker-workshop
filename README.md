# Docker Workshop

## LAUNCH WITH DOCKER

## Launch a clean Ubuntu

```
docker run -i -t ubuntu:14.04 /bin/bash -l
cat /etc/os-release
```

## Use docker as CLI (Pipeline)

```
cat /etc/resolv.conf | docker run -i ubuntu:14.04 wc -l
```

## Expose a Port

```
docker run -d -p 8800:80 tutum/apache-php
google-chrome http://localhost:8800
```

## Change Data

```
docker run -i -t -p 8801:80 tutum/apache-php /bin/bash -l
apachectl start
vi /app/index.php
google-chrome http://localhost:8801
```

## BUILD WITH DOCKER

### Simple Dockerfile

* Git Client

```
FROM ubuntu:14.04
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -qqy install git
```

```
docker build -t docker-git .
docker run -it docker-git /bin/bash -l
git --version
```

* Apache Server

```
FROM ubuntu:14.04
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -qqy install apache2
EXPOSE 80
CMD apachectl start; tail -f /var/log/apache2/access.log
```

```
docker build -t docker-apache .
docker run -d -p 8700:80 docker-apache 
google-chrome http://localhost:8700/
```

## DEPLOY WITH DOCKER

## Linking Containers

```
docker run --rm --name redis dockerfile/redis
docker run -it --rm --link redis:server dockerfile/redis bash -c 'redis-cli -h $SERVER_PORT_6379_TCP_ADDR'
docker run -it --rm --link redis:redis relateiq/redis-cli
set hello world
get hello
```

## [Embassador Pattern](http://docs.docker.com/articles/ambassador_pattern_linking/)

host A:

```
docker run --rm --name redis dockerfile/redis
docker run -d --link redis:redis --name redis_ambassador -p 6379:6379 svendowideit/ambassador

```

host B:

```
docker run -d --name redis_ambassador --expose 6379 -e REDIS_PORT_6379_TCP=tcp://10.0.16.172:6379 svendowideit/ambassador
docker run -i -t --rm --link redis_ambassador:redis relateiq/redis-cli
```

* Let's connect: Launch Host B commands and execute the following:

```
RPUSH attendees "PUT YOUR NAME HERE"
LRANGE attendees 0 -1
```

## [Data Volume Pattern](http://docs.docker.com/userguide/dockervolumes/)

```
docker run -i -t -p 8802:80 --name web -v /app tutum/apache-php
google-chrome http://localhost:8802
docker run -i -t -P --volumes-from web ubuntu /bin/bash -l
vi /app/index.php
```

## [Service Discovery Pattern](https://github.com/crosbymichael/skydock)

```
sudo vi /etc/default/docker
sudo service docker restart
docker run -d -p 172.17.42.1:53:53/udp --name skydns crosbymichael/skydns -nameserver 8.8.8.8:53 -domain docker
docker run -d -v /var/run/docker.sock:/docker.sock --name skydock crosbymichael/skydock -ttl 30 -environment dev -s /docker.sock -domain docker -name skydns
```

* Redis Service

```
docker run -d --name redis1 crosbymichael/redis
docker run -d --name redis2 crosbymichael/redis
docker run -d --name redis3 crosbymichael/redis
docker run -t -i crosbymichael/redis-cli -h redis.dev.docker
set hello world
get hello
```

* Service discovery with DNS:

```
dig @172.17.42.1 +short redis1.dev.docker
dig @172.17.42.1 +short redis.dev.docker
```

* Load Balancing with DNS

```
docker rm -f redis1
get hello
dig @172.17.42.1 +short redis.dev.docker
```


## Helper Methods

### Cleanup Stopped Containers

```
docker rm $(docker ps -q -a)
```

### Cleanup Untagged Images

```
docker rmi $(docker images | grep "^<none>" | awk '{print $3}')
```
