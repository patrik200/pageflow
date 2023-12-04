import { Region } from "minio";

export interface S3ConfigInterface {
  region: Region;
  host: string;
  port: number;
  accessKey: string;
  secretKey: string;
}
