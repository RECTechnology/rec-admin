#!/bin/bash
set -e

npm run build:prod

mv dist/* /var/www/html

nginx -g 'daemon off;'
