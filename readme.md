### Initialize project for local backend development
1. `npm run local-install`
2. copy `.env.example` to `.env`
3. `docker compose -f ./docker-compose-local.yml up -d`
4. run npm scripts: `dev:kit` `dev:shared-enums` `dev:backend:core-config` `dev:backend:back-kit` `dev:backend:core`

### Steps after first run backend
1. cd packages/back/backend
2. Create client `npm run send:dev create-client -- -n testname -d localhost`
3. Create admin `npm run send:dev create-admin -- -c 1 -e admin@pageflow.ru`

### Generate crypto iv

```js
crypto.randomBytes(16).toString("base64url")
```

### Generate crypto key

```js
crypto.randomBytes(24).toString("base64url")
```

----
Именование методов в бэке по префиксу
`unsafe` - нет проверки доступов, есть проверка клиента
`danger` - нет никаких проверок
----

### Порядок импортов
переводы строк именно такие
```
react
пакеты node_modules

components (ui)

constants

libs

entities

other modules

other services

other storages

relative controllers

relative services

relative dto

relative components

relative styles
```

пример (смешан и бэк и фронт)

```ts
import React from "react";
import { Typography } from "@app/ui-kit";
import { observable } from "mobx";
import { Injectable } from "@nestjs/common";
import { CryptoService } from "@app/back-kit";
import { config } from "@app/config";

import Breadcrumbs from "components/breadcrumbs";

import { dtoMessageIsDefined } from "constants/dtoErrorMessage";

import { ClientEntity } from "entities/client";
import { DictionaryEntity } from "entities/Dictionary/Dictionary";

import { ClientEntity } from "core/entities/client";

import { DocumentStorage } from "core/sotrages/document";
import { HomeStorage } from "core/sotrages/home";

import { ElasticRecreateIndexesService } from "modules/elastic/services/recreate-indexes";

import { SomeController } from "../controllers";

import { SomeCreateService } from "../services/create";
import { SomeDeleteService } from "../services/delete";

import { SomeResponseDTO } from "../dto/Response";
import { SomeResponseDTO2 } from "../dto/Response2";

import { SomeSmallCard, SomeSmallCardInterface } from "./Card/Small";

import { wrapperStyles } from "./styles.css";
```

----

### Run commands

```shell
cd packages/back/backend
npm run send:dev
# npm run send:dev help
```

----

### S3 Docs
https://s3-server.readthedocs.io/en/latest/DOCKER.html


### Как работает s3 поиск по вложениям
https://www.elastic.co/guide/en/elasticsearch/reference/8.8/attachment.html
https://discuss.elastic.co/t/to-store-and-search-a-file-content-using-elastic-search/237062
https://github.com/rahulsinghai/elasticsearch-ingest-attachment-plugin-example/blob/master/README.md

-----
Ошибка buildkit докера фиксится через env `DOCKER_BUILDKIT=0`