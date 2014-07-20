FROM ubuntu:14.04
MAINTAINER Dimitris Kapanidis <spiddy@harbur.io>

RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -qqy install apache2

EXPOSE 80
CMD apachectl start; tail -f /var/log/apache2/access.log
