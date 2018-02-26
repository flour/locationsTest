FROM alpine
RUN apk update && apk add --update nodejs nodejs-npm
ADD . /locations
WORKDIR /locations
RUN npm install
EXPOSE 10010
CMD [ "node", "app.js" ]