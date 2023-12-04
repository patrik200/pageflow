import type { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export type TypeormUpdateEntity<ENTITY> = QueryDeepPartialEntity<ENTITY>;
