FROM php:5.6-apache

RUN apt-get update && apt-get install -y vim


COPY ./templates /var/apache2/templates
COPY  ./conf /etc/apache2/
COPY ./apache2-foreground /usr/local/bin

RUN a2enmod proxy proxy_http
RUN a2ensite 000-* 001-*


