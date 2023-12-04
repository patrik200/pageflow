import { PaginatedFindResult, PaginationEntity, PaginationQueryInterface } from "@app/kit";

export function getPaginationFindOptions(pagination: PaginationQueryInterface) {
  return { take: pagination.perPage, skip: (pagination.page - 1) * pagination.perPage };
}

export function injectPaginationToFindAndCountResult<Entity>(
  pagination: PaginationQueryInterface,
  [items, totalCount]: [Entity[], number],
): PaginatedFindResult<Entity> {
  const entity = PaginationEntity.build({ page: pagination.page, perPage: pagination.perPage, totalCount });
  return { items, pagination: entity };
}
