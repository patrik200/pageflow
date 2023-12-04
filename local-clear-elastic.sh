DATA_DIR='./elasticdata'
docker compose -f docker-compose-local.yml stop elastic
if [ -d '$DATA_DIR' ]; then
    chmod -R 777 $DATA_DIR
fi
rm -rfv $DATA_DIR
docker compose -f docker-compose-local.yml up -d elastic
