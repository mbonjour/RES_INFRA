FROM node:8.16

RUN apt-get update && apt-get install -y vim

COPY src/ /opt/app/
WORKDIR /opt/app

RUN npm install
ENTRYPOINT ["node", "/opt/app/index.js"]
