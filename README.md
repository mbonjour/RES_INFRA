# RES_INFRA
## Authors : MIckael Bonjour & Samuel Mettler

HTTP infrastructure laboratory

# Infos globales
Les ports choisis pour notre implémentation avec express est 3000 (interne au docker) quant aux serveurs statiques nous avons laissés de base 80 pour apache. Pareil pour le reverse proxy.

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
## Config files
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

## Answers
We can't access to the static or dynamic HTTP server directly because it's in the Docker infra and there aren't port mapping done.
The static configuration is weak because it's based on the IP of the containers and this IP is volatile in the docker infrastructure.
# Step 4 - AJAX requests with JQuery
## Dockerfile explained
I'v added as the webcasts suggested the vim package to all images for the tests.
## Demo
Iy you want to have a working demo for this step we need to do exactly as the step 3 but before we need to do a fesh start. For this we need to remove all containers and stop them all.
After that you need to rebuild the three images :
In docker-images/apache-php-image/
> docker build -t res/apache-php .

In docker-images/express-image
> docker build -t res/express-beer

In docker-images/apache-reverse-proxy
> docker build -t res/reverse-proxy

When we have build all the images we need to start them all using exactly this order :
> docker run -d --name apace-static res/apache-php

> docker run -d --name express-beer res/express-beer

> docker run -d -p 8080:80 --name apache-rp res/reverse-proxy

If you have a good /etc/hosts file (c.f. step 3) you can now go on demo.res.ch:8080 and Enjoy...
# Setp 5 - Dynamic reverse proxy configuration
## Dockerfile explained
I've just added som COPY to dockerfiles to add the template file of the reverse proxy and the setup script for the apache image *apache2-foreground*.
## Demo
For the demo you hust need to run a static container and one dynamic from the previous steps.

> docker run -d res/apache-static

> docker run -d res/express-students

And the recup their ipaddress with :

> docker inspect name_of_the_container | grep -i ipaddress

When you have the ip addresses of both of the containers you can launch the dynamic reverse proxy by first building it in docker-images/apache-reverse-proxy :

> docker build -t res/reverse-proxy .

> docker run -d -p 8080:80 -e STATIC_APP=ip_address_of_sttic container -e DYNAMIC_APP=ip_address_of_dynamic_container res/reverse_proxy

## Config
I've added to the base apache2-foreground an *php config-template.php > /etc/apache2/sites-available/001-reverse.conf* to generate dynamically the configuration of the proxy from the environment variables *STATIC_APP* and *DYNAMIC_APP*.

# Step 6 - Load Balancing : multiple server nodes
## Dockerfile explained
We juste added in the apache-reverse-proxy dockerfile some RUN commands to enable the balancing modules. In fact that's all we had to add for the implementation to work.
## Demo
You need to build the 3 docker images (c.f. Demo chapter 4) ans then run some static php images and some dynamic express images.
Afetr you did that you need to know the IP addresses of the containers Dynamic and the static ones. When you do you have to run the proxy somewhat like that :

docker run -d -p 8080:80 -e DYNMAIC_APP=ip_address1:portNR\;ip_address2:portNR\;ip_adress3:portNR -e STATIC_APP=ip_address4:portNR\;ip_address5:portNR\;ip_address6:portNR res/reverse-proxy

After that you can go to demo.res.ch:8080 and see if it works. For time reasons we havn't implemented the verification of the static balancing verification but for the dynamic one yes. In fact if you launch some instances of the website you can see that de dynamic is served by multiple servers.

## Config
For the configuration we have essentially based our config from a website which is https://linuxtechlab.com/use-apache-reverse-proxy-as-load-balancer/ and we haven't done much more in fact. But well it works. It's simple we modified the template to create 2 LoadBalancer, one for the static webistes passed as Env vars and one for the dynamic ones.

We modified the config of the dynamic and the static pages to add the ip address of the server who sent the information to see that it isn't always the same one. So we an see by who the dynamic information is served, But for the static one we didn't had teh time to do the same.


