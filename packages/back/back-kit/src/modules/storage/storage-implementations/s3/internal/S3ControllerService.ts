import { Logger } from "@nestjs/common";
import { Client } from "minio";

import { S3ConfigInterface } from "../types";

export class S3ControllerService {
  static async register(s3Config: S3ConfigInterface) {
    const s3 = new Client({
      region: s3Config.region,
      useSSL: false,
      endPoint: s3Config.host,
      port: s3Config.port,
      accessKey: s3Config.accessKey,
      secretKey: s3Config.secretKey,
    });

    return new S3ControllerService(s3, s3Config);
  }

  constructor(public s3: Client, private s3Config: S3ConfigInterface) {
    Logger.log(`Configured S3 controller`, "S3");
  }
}
