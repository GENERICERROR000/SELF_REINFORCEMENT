
FROM node:8.16.2-jessie
# FROM node:8.16.2-alpine

LABEL maintainer="Noah Kernis -//-"

ENV HOST=""
ENV PORT=""
ENV MODE=""
ENV NAME=""
ENV ID=""
ENV BASES=""
ENV PEER_SERVER=""
ENV PEER_PORT=""

COPY --chown=node . /usr/src/app

WORKDIR /usr/src/app

RUN chmod +x ./bin/entrypoint.sh

RUN npm install 

USER node

ENTRYPOINT ["/usr/src/app/bin/entrypoint.sh"]

CMD ["node", "index.js"]
