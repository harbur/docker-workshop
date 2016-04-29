# [![harbur.io](https://en.gravatar.com/userimage/10968596/06879c44248462a1bac025dd999fe704.png?size=64)](http://harbur.io) Docker Workshop - Docker machine

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


