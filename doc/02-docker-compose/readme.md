# [![harbur.io](https://harbur.io/logo/Color/Logo/Harbur-40x40.png)](http://harbur.io) Docker Workshop - Docker Compose


This section will show how to use Docker Compose with some small exercises and with a simple Node/Redis app. Before starting, you'll need to have [Docker Compose installed](https://docs.docker.com/compose/install/).

# Docker-compose

Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a Compose file to configure your application’s services. Then, using a single command, you create and start all the services from your configuration. To learn more about all the features of Compose see [the list of features](https://docs.docker.com/compose/overview/#features).

Using Compose is basically a three-step process:

1.Define your app’s environment with a `Dockerfile` so it can be reproduced anywhere.
1.Define the services that make up your app in `docker-compose.yml` so they can be run together in an isolated environment.
1.Lastly, run `docker-compose up` and Compose will start and run your entire app.


## Commands

Check the available commands of Docker Compose. Type in your terminal:

```
docker-compose
```

* Whenever you don't remember a command, just type docker-compose
* For more info, type `docker-compose help COMMAND` (e.g. `docker-compose help build`)

## docker-compose.yml

The `docker-compose.yml` file is a [YAML](http://yaml.org/) file defining [services](https://docs.docker.com/compose/compose-file/#service-configuration-reference), [networks](https://docs.docker.com/compose/compose-file/#network-configuration-reference) and [volumes](https://docs.docker.com/compose/compose-file/#volume-configuration-reference). The default path for a Compose file is `./docker-compose.yml`.

A service definition contains configuration which will be applied to each container started for that service, much like passing command-line parameters to `docker run`. Likewise, network and volume definitions are analogous to `docker network create` and `docker volume create`.

Options specified in the `Dockerfile` (e.g., `CMD`, `EXPOSE`, `VOLUME`, `ENV`) are respected by default - you don’t need to specify them again in `docker-compose.yml`.


## Project's components

We've already created a simple app in `code/guestbook-node` that uses node.js with express and redis.

1. Go to `code/guestbook-node` folder

2. Review `Dockerfile`:

```
FROM mhart/alpine-node:latest
RUN mkdir /code
WORKDIR /code
ADD package.json /code/
RUN npm install
ADD . /code/
CMD ["node", "main.js"]
```

We use the base image of `mhart/alpine-node`. Although it's not the official nodejs image, we preferred to use it because it's based in Alpine, a light linux distribution. 

The `Dockerfile` then creates the directory where our code will be stored, `/code`, and it copies the `package.json` so it can install the node dependencies.

Afterwards it copies all the code we have in the host machine and runs the command that will keep the container running.

3. Review `docker-compose.yml`:

```
version: '2'
services:
  redis:
    image: redis:alpine
  web:
    build: .
    ports:
      - "80:3000"
    depends_on:
      - redis
```

The `docker-compose.yml` file describes the services that make your app. In this example those services are a web server and database. The compose file also describes which Docker images these services use, how they link together, any volumes they might need mounted inside the containers. Finally, the `docker-compose.yml` file describes which ports these services expose. See the docker-compose.yml [reference](https://docs.docker.com/compose/compose-file/) for more information on how this file works.

In this case, we defined two services, `redis` that uses `redis:alpine` and `web`, our nodejs app. We linked the two of them, and `web` depends on `redis` as you can see in `depends_on`. Also, our nodejs app listens the port `3000` so we linked host's port 80 to the docker container 3000 port.


## Run the app

Type in your terminal: 

```
docker-compose up
```

This instructs Compose to run the services defined in the `docker-compose.yml` in containers, using the `redis` image and the `web` service's image and configuration. Because the `web` image doesn't exist yet, Compose builds it from the current directory, as specified by the `build: .` line in `docker-compose.yml`.

At this point, your Node app should be running at port `80` on your Docker host. If you are using a Docker Machine VM, you can use the `docker-machine ip MACHINE_NAME` to get the IP address.

# Navigation 

Previous | Next 
:------- | ---: 
← [Docker Workshop - Docker machine](../01-docker-machine) | [Docker Workshop - Home](https://github.com/harbur/docker-workshop) →

# Credits

This workshop was prepared by [harbur.io](http://harbur.io), under MIT License. Feel free to fork and improve.