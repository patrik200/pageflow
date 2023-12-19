import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { PaginationQueryInterface } from "@app/kit";

import { BaseExpressRequest } from "types";

function getPageParamsFromExecutionContext(ctx: ExecutionContext) {
  switch (ctx.getType()) {
    case "http": {
      const request = ctx.switchToHttp().getRequest<BaseExpressRequest<{}>>();
      const { page, perPage } = Object.assign({}, request.query, request.body);
      return { page, perPage };
    }
    case "ws": {
      const { page, perPage } = ctx.switchToWs().getData();
      return { page, perPage };
    }
    default:
      throw new Error("Unsupported protocol");
  }
}

function withPaginationFactory(
  { maxPerPage = 20, optional }: { maxPerPage?: number; optional?: true } = {},
  ctx: ExecutionContext,
): PaginationQueryInterface | null {
  const { page: rawPage, perPage: rawPerPage } = getPageParamsFromExecutionContext(ctx);
  try {
    const page = parseFloat(rawPage);
    const perPage = parseFloat(rawPerPage);
    if (isNaN(page) || isNaN(perPage)) {
      if (optional === true) return null;
      throw new Error("Bad param");
    }
    if (page < 1 || perPage < 1) throw new Error("Bad param");
    const resultPerPage = Math.ceil(perPage);
    if (resultPerPage > maxPerPage) throw new Error("Bad param");
    return { page: Math.ceil(page), perPage: resultPerPage };
  } catch (e) {
    throw new HttpException("", HttpStatus.NOT_FOUND);
  }
}

export const withPagination = createParamDecorator(withPaginationFactory);
