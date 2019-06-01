FROM node:4.4

COPY src/ /opt/app/
WORKDIR /opt/app

RUN npm install
ENTRYPOINT ["node", "/opt/app/index.js"]
