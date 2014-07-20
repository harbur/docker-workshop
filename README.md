# Docker Workshop [![Gitter chat](https://badges.gitter.im/spiddy/docker-workshop.png)](https://gitter.im/spiddy/docker-workshop)

The Workshop is separated in three sections

* CLI Basics
* Dockerfile basics
* Docker Patterns

Preparations:

* Clone this repo: `git clone https://github.com/spiddy/docker-workshop` (Some code examples require files located here)
* Warm-up the images:

```
docker pull busybox:latest
docker pull ubuntu:latest
docker pull nginx:latest
docker pull dockerfile/redis
docker pull relateiq/redis-cli
docker pull svendowideit/ambassador
docker pull crosbymichael/skydns
docker pull crosbymichael/skydock
docker pull crosbymichael/redis
```

# CLI Basics

### Version

Check you have latest version of docker installed:

```
docker version
```

* If you don't have docker installed, check [here](https://docs.docker.com/installation/#installation)
* If you're not on the latest version, it will prompt you to update
* If you're not on docker group you might need to prefix commands with `sudo`. See [here](http://docs.docker.com/installation/ubuntulinux/#giving-non-root-access) for details about it.

### Commands

Check the available docker commands

```
docker
```

* Whenever you don't remember a command, just type docker
* For more info, type `docker help COMMAND` (e.g. `docker help run`)

### RUN a "Hello World" container

```
docker run busybox echo "Hello World"
```

* If the Image is not cached, it pulls it automatically
* It prints `Hello World` and exits

### RUN an interactive Container

```
docker run -it busybox sh
  cat /etc/os-release
  exit
```

* **-i**: Keep stdin open even if not attached
* **-t**: Allocate a pseudo-tty

### RUN a Container with pipeline

```
cat /etc/resolv.conf | docker run -i busybox wc -l
```

### SEARCH a Container

```
docker search -s 10 nginx
```

* **-s**: Only displays with at least x stars

### RUN a Container and expose a Port

```
docker run -d -p 40080:80 nginx
google-chrome http://localhost:40080
```

* **-d**: Detached mode: Run container in the background, print new container id
* **-p**: Publish a container's port to the host (format: *hostPort:containerPort*)
* For more info about the container, see [nginx](https://registry.hub.docker.com/_/nginx/)

### RUN a Container with a Volume

```
docker run -d -p 40081:80 -v $(pwd)/ex1-container-with-volume/:/usr/local/nginx/html:ro nginx
google-chrome http://localhost:40081
```

* **-d**: Bind mount a volume (e.g., from the host: -v /host:/container, from docker: -v /container)
* The volume is **linked** inside the container. Any external changes are visible directly inside the container.
* This example breaks the immutability of the container, good for debuging, not recommended for production (Volumes should be used for data, not code)

### IMAGES - Show Images

```
docker images
```

### PS - Show Containers

```
docker ps
docker ps -a
```

* **-a**: Show all containers. Only running containers are shown by default.

## Workshop 1 (10 mins)

* Build a static website
* Run it on your machine
* Share your (non-localhost) url on Chat room [![Gitter chat](https://badges.gitter.im/spiddy/docker-workshop.png)](https://gitter.im/spiddy/docker-workshop)

# Dockerfile Basics

### Build a Git Client Container

Create a Git Container manually:

```
docker run -it --name git ubuntu bash
  apt-get update
  apt-get install git
  git version
  exit
docker commit git docker-git
docker rm git
docker run -it docker-git git version
docker rmi docker-git
```

* **--name**: Assign a name to the container
* **commit**: Create a new image from a container's changes
* **rm**: Remove one or more containers
* **rmi**: Remove one or more images

Create a Git Container with Dockerfile:

```
cd docker-git
docker build -t docker-git .
docker run -it docker-git git version
```

* **build**: Build an image from a Dockerfile

[Dockerfile](docker-git/Dockerfile):

```
FROM ubuntu:14.04
MAINTAINER Dimitris Kapanidis <spiddy@harbur.io>
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -qqy install git
```

* The **FROM** instruction sets the Base Image for subsequent instructions
* The **MAINTAINER** instruction allows you to set the Author field of the generated images
* The **RUN** instruction will execute any commands in a new layer on top of the current image and commit the results

### Build an Apache Server Container

cd docker-apache2

```
FROM ubuntu:14.04
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -qqy install apache2
EXPOSE 80
CMD apachectl start; tail -f /var/log/apache2/access.log
```

```
docker build -t docker-apache2 .
docker run -d -p 8700:80 docker-apache2
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
