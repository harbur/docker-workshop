# [![harbur.io](https://en.gravatar.com/userimage/10968596/06879c44248462a1bac025dd999fe704.png?size=64)](http://harbur.io) Docker Workshop - Docker Compose


This section will show how to use Docker Compose to set up and run a simple Node/Redis app. Before starting, you'll need to have [Docker Compose installed](https://docs.docker.com/compose/install/).


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
