import type { Request } from "express";

export declare type CustomExpressRequest = Omit<Request, "headers"> & {
  headers: Record<string, string>;
};
