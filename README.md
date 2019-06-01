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
