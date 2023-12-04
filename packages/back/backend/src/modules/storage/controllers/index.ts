import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { StorageControllerService } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { withUserAuthorized } from "modules/auth";

@Controller("storage")
export class StorageController {
  constructor(private storageControllerService: StorageControllerService) {}

  @Get("files/:bucket/:fileId")
  @withUserAuthorized([UserRole.USER])
  async fileAuthorizedOrCertainUser(
    @Res() res: Response,
    @Param("bucket") bucket: string,
    @Param("fileId") id: string,
    @Query("width") width: string,
  ) {
    return await this.storageControllerService.file(res, { bucket, id }, { width });
  }
}
