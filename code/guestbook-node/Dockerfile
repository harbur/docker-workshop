FROM node:7.7.0-alpine
RUN mkdir /code
WORKDIR /code
ADD package.json /code/
RUN npm install
ADD . /code/
CMD ["node", "main.js"]
