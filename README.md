# [![harbur.io](https://harbur.io/logo/Color/Logo/Harbur-40x40.png)](http://harbur.io) Docker Workshop

The Workshop is separated in three sections:

* [Docker Basics](doc/00-docker-basics)
* [Docker Machine](doc/01-docker-machine)
* [Docker Compose](doc/02-docker-compose)

### Preparations:

* [Install Docker](https://docs.docker.com/engine/installation/)
* Clone this repo: `git clone https://github.com/harbur/docker-workshop` (Some code examples require files located here)
* Warm-up the images:

```
docker pull alpine
docker pull nginx
```

### Assumptions:

* During workshop the following ports are used: `80` and the range `4000-4010`. If they are not available on your machine, adjust the CLI commands accordingly.

### Chat
![Members online on Docker Barcelona Slack](https://dockerbcn.herokuapp.com/badge.svg)

Join [Docker Barcelona Slack](https://dockerbcn.herokuapp.com)! 

### Docker Cheat Sheet:

We've wrote a page with some useful docker commands: [Harbur's docker-cheat-sheet](https://github.com/harbur/docker-cheat-sheet).

# Credits

This workshop was prepared by [harbur.io](http://harbur.io), under MIT License. Feel free to fork and improve.