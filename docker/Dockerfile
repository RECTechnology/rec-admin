FROM debian
RUN apt update && apt install -y curl gnupg nginx build-essential gettext-base git
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt install -y nodejs
COPY . /build
COPY nginx.vhost /etc/nginx/sites-available/default
WORKDIR /build
RUN chmod +x docker-entrypoint.sh
RUN npm install 
CMD ["./docker-entrypoint.sh"]
