FROM node:lts-alpine 

RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home 
 
WORKDIR /home/node/api 

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "node", "index.js" ]