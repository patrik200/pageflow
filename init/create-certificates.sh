#!/bin/sh

EMAIL="edelgarat@yandex.ru"
DOMAIN="pageflow.ru"
WILDCARD_DOMAIN="*.$DOMAIN"

sudo certbot certonly --agree-tos --manual --preferred-challenges dns \
  --email $EMAIL --server https://acme-v02.api.letsencrypt.org/directory \
  -d $DOMAIN -d "$WILDCARD_DOMAIN" --manual-public-ip-logging-ok
