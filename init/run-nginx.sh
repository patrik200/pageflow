#!/bin/sh

sudo service nginx stop

sudo cp ./configs/nginx.conf /etc/nginx/nginx.conf

sudo nginx -t

sudo service nginx start

sudo service nginx status
