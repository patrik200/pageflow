import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PermissionEntity } from "entities/Permission";
import { TicketBoardEntity } from "entities/TicketBoard";
import { ProjectEntity } from "entities/Project";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";
import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentEntity } from "entities/Document/Document";

import { PermissionAccessEntityService } from "./services/_accessEntity";
import { PermissionAccessService } from "./services/access";
import { CreatePermissionService } from "./services/create";
import { DeletePermissionService } from "./services/delete";
import { EditPermissionService } from "./services/edit";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermissionEntity,
      TicketBoardEntity,
      ProjectEntity,
      CorrespondenceGroupEntity,
      CorrespondenceEntity,
      DocumentGroupEntity,
      DocumentEntity,
    ]),
  ],
  providers: [
    PermissionAccessEntityService,
    PermissionAccessService,
    CreatePermissionService,
    DeletePermissionService,
    EditPermissionService,
  ],
  exports: [PermissionAccessService, CreatePermissionService, DeletePermissionService, EditPermissionService],
})
export class PermissionsModule {}

export * from "./dto/Create";
export * from "./dto/Edit";
export * from "./dto/Delete";
export * from "./dto/Permission";

export * from "./services/access";
export * from "./services/create";
export * from "./services/delete";
export * from "./services/edit";
