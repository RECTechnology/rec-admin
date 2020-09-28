#!/bin/bash
set -e

# echo "Envsubst"

# echo "Building"
# npm run build:prod

# echo "Copying build"
# mv dist/* /var/www/html
envsubst < /var/www/html/env.js.dist > /var/www/html/env.js

echo "Starting nginx"
nginx -g 'daemon off;'
