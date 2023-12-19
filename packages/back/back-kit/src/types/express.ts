import { Request } from "express";
import { IncomingHttpHeaders } from "node:http";

export interface ExpressMultipartFile {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: IncomingHttpHeaders;
  size: number;
  name: string;
  type: string;
}

export type BaseExpressRequest<USER> = Omit<Request, "user"> & {
  files: Record<string, ExpressMultipartFile | undefined>;
  user: USER;
};
