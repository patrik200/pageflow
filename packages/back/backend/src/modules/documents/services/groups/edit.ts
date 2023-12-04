import { TypeormUpdateEntity } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentGroupEntity } from "entities/Document/Group/group";

import { PermissionAccessService } from "modules/permissions";

import { EditDocumentGroupsElasticService } from "./elastic";
import { GetDocumentGroupService } from "./get";

export interface UpdateDocumentGroupInterface {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

@Injectable()
export class EditDocumentGroupService {
  constructor(
    @InjectRepository(DocumentGroupEntity) private documentGroupRepository: Repository<DocumentGroupEntity>,
    private getDocumentGroupService: GetDocumentGroupService,
    private editDocumentGroupsElasticService: EditDocumentGroupsElasticService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async updateGroupOrFail(groupId: string, data: UpdateDocumentGroupInterface) {
    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: groupId, entityType: PermissionEntityType.DOCUMENT_GROUP },
      true,
    );
    const group = await this.getDocumentGroupService.getGroupOrFail(groupId);

    const updateOptions: TypeormUpdateEntity<DocumentGroupEntity> = {};
    if (data.name) updateOptions.name = data.name;
    if (data.description) updateOptions.description = data.description;
    if (data.isPrivate !== undefined) updateOptions.isPrivate = data.isPrivate;

    await Promise.all([
      this.documentGroupRepository.update(group.id, updateOptions),
      this.editDocumentGroupsElasticService.elasticUpdateGroupIndexOrFail(group.id, data),
    ]);
  }
}
