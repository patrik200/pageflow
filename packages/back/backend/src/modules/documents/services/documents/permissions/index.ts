import { Global, Module } from "@nestjs/common";

import { DocumentPermissionsController } from "./controller";
import { CreateDocumentPermissionsService } from "./create";
import { DeleteDocumentPermissionsService } from "./delete";
import { EditDocumentPermissionsService } from "./edit";

@Global()
@Module({
  controllers: [DocumentPermissionsController],
  providers: [CreateDocumentPermissionsService, DeleteDocumentPermissionsService, EditDocumentPermissionsService],
  exports: [CreateDocumentPermissionsService, DeleteDocumentPermissionsService, EditDocumentPermissionsService],
})
export class DocumentsPermissionsModule {}

export * from "./create";
export * from "./delete";
export * from "./edit";
