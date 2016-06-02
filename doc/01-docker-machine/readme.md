# [![harbur.io](https://harbur.io/logo/Color/Logo/Harbur-40x40.png)](http://harbur.io) Docker Workshop - Docker machine

In this section we'll introduce `docker-machine`.

## Install Docker Toolbox

Download and install [Docker Toolbox](https://www.docker.com/docker-toolbox).

The toolbox installs a handful of tools on your local Windows or Mac OS X computer. In this exercise, you use two of those tools:

* Docker Machine: To deploy virtual machines that run Docker Engine
* VirtualBox: To host the virtual machines deployed from Docker Machine


## Create a VM running Docker

Open a terminal on your computer. 

Create and run a VM named `default`:

```
docker-machine create -d virtualbox default
```

You can list the existing docker-machines:

```
docker-machine ls
```


Start the VM named `default`:

```
docker-machine start default
```

## Run a docker container in a docker-machine

Now, let's use the docker-machine we've just created. We want to run the `hello-world`.

If you use Mac, you need to run:
```
eval $(docker machine env default)
```

This command set the `DOCKER_HOST` variable to the IP of your `default` `docker-machine`.

Then we can run the `hello-world` container:
```
docker run hello-world
```


## Clean up

After we tested our `default` `docker-machine` we want to remove it from our computer.

Stop the VM named `default`:

```
docker-machine stop default
```

You can destroy the VM named `default`:

```
docker-machine rm default
```

# Navigation 

Previous | Next 
:------- | ---: 
← [Docker Workshop - Docker Basics](../00-docker-basics) | [Docker Workshop - Docker Compose](../02-docker-compose) →

# Credits

This workshop was prepared by [harbur.io](http://harbur.io), under MIT License. Feel free to fork and improve.