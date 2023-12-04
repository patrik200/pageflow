import { UserRole } from "@app/shared-enums";
import { Controller, Post } from "@nestjs/common";

import { withUserAuthorized } from "modules/auth";

import { ElasticRecreateIndexesService } from "../services/recreate-indexes";

@Controller("elastic")
export class ElasticController {
  constructor(private elasticRecreateIndexesService: ElasticRecreateIndexesService) {}

  @Post("recreate-indexes")
  @withUserAuthorized([UserRole.ADMIN], { processAsGet: true })
  async recreateCurrentClientIndexes() {
    await this.elasticRecreateIndexesService.recreateCurrentClientIndexes();
  }
}
