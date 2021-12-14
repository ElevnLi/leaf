FROM nginx:latest
RUN apt update
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt install -y nodejs
RUN npm install -g typescript@latest
RUN mkdir /code /code/public /code/src
COPY ./public /code/public
COPY ./src /code/src
COPY package.json package-lock.json /code/
RUN cd /code && find . && npm install && npm run build

RUN mkdir /app
RUN cp -R /code/build/* /app/

COPY ./nginx.conf /etc/nginx/nginx.conf
