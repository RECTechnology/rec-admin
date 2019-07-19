#!/bin/bash
set -e

echo "Envsubst"
envsubst < src/environments/environment.ts.dist > src/environments/environment.ts

echo "Building"
npm run build:prod

echo "Copying build"
mv dist/* /var/www/html

echo "Starting nginx"
nginx -g 'daemon off;'
