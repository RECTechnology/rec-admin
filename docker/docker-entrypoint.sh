#!/bin/bash
set -e

envsubst < parameters.json.dist > parameters.json

npm run white-label
npm run build:prod

mv prod/* /var/www/html

nginx -g 'daemon off;'
