#!/bin/bash
set -e

sed 

npm run build:prod

mv dist/* /var/www/html

nginx -g 'daemon off;'
