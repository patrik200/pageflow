import { Global, Module } from "@nestjs/common";

import { CorrespondenceGroupPermissionsController } from "./controller";
import { CreateCorrespondenceGroupPermissionsService } from "./create";
import { DeleteCorrespondenceGroupPermissionsService } from "./delete";
import { EditCorrespondenceGroupPermissionsService } from "./edit";

@Global()
@Module({
  controllers: [CorrespondenceGroupPermissionsController],
  providers: [
    CreateCorrespondenceGroupPermissionsService,
    DeleteCorrespondenceGroupPermissionsService,
    EditCorrespondenceGroupPermissionsService,
  ],
  exports: [
    CreateCorrespondenceGroupPermissionsService,
    DeleteCorrespondenceGroupPermissionsService,
    EditCorrespondenceGroupPermissionsService,
  ],
})
export class CorrespondencesGroupPermissionsModule {}

export * from "./create";
export * from "./delete";
export * from "./edit";
