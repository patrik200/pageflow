import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

import { typeormAlias } from "./typeormAlias";

export function addTypeOrmFindRelationsToQueryBuilder<ENTITY extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<ENTITY>,
  relations: string[] | undefined = [],
) {
  for (const relation of [...relations].sort()) {
    const [child, parent = typeormAlias] = relation.split(".").reverse() as [string, string | undefined];
    queryBuilder.leftJoinAndSelect(`${parent}.${child}`, child);
  }
}
