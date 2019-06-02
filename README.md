# RES_INFRA
## Authors : MIckael Bonjour & Samuel Mettler

HTTP infrastructure laboratory

# Structure
docker-images/
		apache-php-images/
				Dockerfile
				content/
						staticSite

# Step 1 - Static HTTP server with apache httpd
## Dockerfile explained
This Dockerfile is very simple, it's just inspired of an existing apache server from Dockerhub who runs php (php:5.6-apache). It copies the content files to the /var/www/html dir of the container. It's the default location of the container for serving HTML files.
## Demo
Go to docker-images/apache-php-image and run
> docker build -t res/apache-php .
> docker run -d -p 9090:80 res/apache-php

You can now go on localhost:9090 (for linux users)
## Config files
No COnfig files necessary  for this exercise but they are in /etc/apache2/

# Step 2 - Dynamic HTTP server with express.js
## Dockerfile explained
In this Dockerfile we need a bit more than the previous one, in fact we need to copy the content (src here) to the container.
After that we can set the current working directory to the same location (/opt/app) and we need to run *npm install* to resolve dependencies.
I've set an entrypoint for the app as *node /opt/app/index.js* as we can pass args if we want it.

## Demo
For the demo just go to docker-images/express-image and run
> docker build -t res/express-students .
> docker run -d -p 9091:3000 res/express-students
## COnfig files
I haven't touched any of the config files for this exercise
# Step 3 - Reverse Proxy wit apache (static conf)
## Dockerfile explained
This Dockerfile is a file to configure an apache httpd server to be a reverse proxy. In fact this dockerfile is based from php:5.6-apache and runs a2enmod proxy proxy_http.
We have some specific conf files in the conf/ dir to be applied on the container. We need to enable site so the dockerfile do it for us with a2ensite.

## Demo
If you want a demo you need to have 0 running containers and have already builded the containers from the Step 1 & 2.
> docker run -d res/apache-php

> docker run -d res/express-students

After that we can build our image for the reverse :
> docker build -t res/reverse-proxy .

> docker run -d -p 8080:80 res/reverse-proxy

To test the reverse you need to change your /etc/hosts (or any equivalent) and map 127.0.0.1 to demo.res.ch (for native users) or the IP of the docker-machine for others.
## Config files
Static configuration, we have mapped the static http to 172.17.0.2 (demo.res.ch:8080) and the API toward 172.17.0.3 (demo.res.ch/api/beer).
