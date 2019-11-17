
FROM node:8.16.2-jessie
# FROM node:8.16.2-alpine

LABEL maintainer="Noah Kernis -//-"

ENV HOST=""
ENV PORT=""
ENV MODE=""
ENV NAME=""
ENV BASES=""

COPY . /usr/src/app

WORKDIR /usr/src/app

RUN npm install

ENTRYPOINT ["/usr/src/app/bin/entrypoint.sh"]

CMD ["node", "index.js"]