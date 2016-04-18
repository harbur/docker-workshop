# [![harbur.io](https://en.gravatar.com/userimage/10968596/06879c44248462a1bac025dd999fe704.png?size=64)](http://harbur.io) Docker Workshop - Docker machine

In this section we'll introduce `docker-machine`.

## Install Docker Toolbox

Download and install [Docker Toolbox](https://www.docker.com/docker-toolbox).

The toolbox installs a handful of tools on your local Windows or Mac OS X computer. In this exercise, you use two of those tools:

* Docker Machine: To deploy virtual machines that run Docker Engine
* VirtualBox: To host the virtual machines deployed from Docker Machine


## Create a VM running Docker

Open a terminal on your computer. Use Docker Machine to list any VMs in VirtualBox.

```
docker-machine ls
```

Create and run a VM named `default`:

```
docker-machine create -d virtualbox default
```

Start a VM named `default`:

```
docker-machine start default
```

Stop a VM named `default`:

```
docker-machine stop default
```

And if you need to remove the VM, you can destroy a VM named `default`:

```
docker-machine rm default
```