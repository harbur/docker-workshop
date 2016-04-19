# [![harbur.io](https://en.gravatar.com/userimage/10968596/06879c44248462a1bac025dd999fe704.png?size=64)](http://harbur.io) Docker Workshop - Docker Basics

This section is separated in:

* [CLI Basics](#cli-basics)
* [Dockerfile basics](#dockerfile-basics)

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
docker run alpine echo "Hello World"
```

* If the Image is not cached, it pulls it automatically
* It prints `Hello World` and exits

### RUN an interactive Container

```
docker run -it alpine sh
  cat /etc/os-release
```

* **-i**: Keep stdin open even if not attached
* **-t**: Allocate a pseudo-tty

### RUN a Container with pipeline

```
cat /etc/resolv.conf | docker run -i alpine wc -l
```

### SEARCH a Container

```
docker search -s 10 nginx
```

* **-s**: Only displays with at least x stars

### RUN a Container and expose a Port

On Linux:
```
docker run -d -p 4000:80 nginx
google-chrome localhost:4000
```

On Mac:
```
docker run -d -p 4000:80 nginx
open http://$(docker-machine ip default):4000
```

* **-d**: Detached mode: Run container in the background, print new container id
* **-p**: Publish a container's port to the host (format: *hostPort:containerPort*)
* For more info about the container, see [nginx](https://registry.hub.docker.com/_/nginx/)

### RUN a Container with a Volume

On Linux:
```
docker run -d -p 4001:80 -v $(pwd)/src/hello-world/site/:/usr/share/nginx/html:ro nginx
google-chrome localhost:4001
```

On Mac:
```
docker run -d -p 4001:80 -v $(pwd)/src/hello-world/site/:/usr/share/nginx/html:ro nginx
open http://$(docker-machine ip default):4001
```

* **-v**: Bind mount a volume (e.g., from the host: -v /host:/container, from docker: -v /container)
* The volume is **linked** inside the container. Any external changes are visible directly inside the container.
* This example breaks the immutability of the container, good for debuging, not recommended for production (Volumes should be used for data, not code)

## Workshop 1 (10 mins)

* Build a static website
* Run it on your machine
* Share your (non-localhost) url on Chat room [![Gitter chat](https://badges.gitter.im/harbur/docker-workshop.png)](https://gitter.im/harbur/docker-workshop)

# Dockerfile Basics

### BUILD a Git Client Container

Create a Git Container manually:

```
docker run -it --name git alpine sh
  apk --update add git
  git version
  exit
docker commit git docker-git
docker rm git
docker run --rm -it docker-git git version
docker rmi docker-git
```

* **--name**: Assign a name to the container
* **commit**: Create a new image from a container's changes
* **rm**: Remove one or more containers
* **rmi**: Remove one or more images
* **--rm**: Automatically remove the container when it exits

Create a Git Container with Dockerfile:

```
cd src/docker-git
docker build -t docker-git .
docker run -it docker-git git version
```

* **build**: Build an image from a Dockerfile

[src/docker-git/Dockerfile](src/docker-git/Dockerfile)
```
FROM alpine:3.3
RUN apk update
RUN apk add git
```

* The **FROM** instruction sets the Base Image for subsequent instructions
* The **RUN** instruction will execute any commands in a new layer on top of the current image and commit the results

### BUILD an Apache Server Container

Create an Apache Server Container with Dockerfile:

```
cd docker-apache2
docker build -t docker-apache2 .
docker run -d -p 4003:80 docker-apache2
```

On Linux:
```
google-chrome localhost:4003
```

On Mac:
```
open http://$(docker-machine ip default):4003
```

[src/docker-apache2/Dockerfile](src/docker-apache2/Dockerfile)
```
FROM alpine:3.3
RUN apk --update add apache2 && rm -rf /var/cache/apk/*
RUN mkdir -p /run/apache2
EXPOSE 80
CMD httpd -D FOREGROUND
```

* The **EXPOSE** instructions informs Docker that the container will listen on the specified network ports at runtime
* The **CMD** instruction sets the command to be executed when running the image

### BUILD a Static website Image

```
cd src/hello-world
docker build -t hello-world .
docker run -d --name hello -P hello-world
```

On Linux:
```
google-chrome $(docker port hello 80)
```

On Mac:
```
open http://$(docker-machine ip default):${$(docker port hello 80)##*:}
```

* **-P**: Publish all exposed ports to the host interfaces
* **port**: Lookup the public-facing port that is NAT-ed to PRIVATE_PORT

[src/hello-world/Dockerfile](src/hello-world/Dockerfile)
```
FROM nginx:1.8-alpine
ADD site /usr/share/nginx/html
```

* The **ADD** instruction will copy new files from <src> and add them to the container's filesystem at path <dest>

## Workshop 2 (10 mins)

* Build your website with Dockerfile
* Run an instance
* Share your (non-localhost) url on Chat room [![Gitter chat](https://badges.gitter.im/harbur/docker-workshop.png)](https://gitter.im/harbur/docker-workshop)

### PUSH Image to a Registry

```
REGISTRY=localhost:5000
docker tag hello-world $REGISTRY/$(whoami)/hello-world
docker push $REGISTRY/$(whoami)/hello-world
```

* **tag**: Tag an image into a repository
* **push**: Push an image or a repository to a Docker registry server

## Workshop 3 (10 mins)

* Push your website to the local Registry (use your github username)
* Push your website image
* Share your image name on Chat room [![Gitter chat](https://badges.gitter.im/harbur/docker-workshop.png)](https://gitter.im/harbur/docker-workshop)

### PULL Image from a Repository

```
docker pull $REGISTRY/$(whoami)/hello-world
docker run -d -P --name=registry-hello $REGISTRY/$(whoami)/hello-world
```

On Linux:
```
google-chrome $(docker port registry-hello 80)
```

On Mac:
```
open http://$(docker-machine ip default):${$(docker port registry-hello 80)##*:}
```

* **pull**: Pull an image or a repository from a Docker registry server

# Credits

This workshop was prepared by [harbur.io](http://harbur.io), under MIT License. Feel free to fork and improve.
