import { TypeormUpdateEntity } from "@app/back-kit";
import { PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { PermissionAccessService } from "modules/permissions";

import { EditCorrespondenceGroupElasticService } from "./elastic";
import { GetCorrespondenceGroupService } from "./get";

export interface UpdateCorrespondenceGroupInterface {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

@Injectable()
export class EditCorrespondenceGroupService {
  constructor(
    @InjectRepository(CorrespondenceGroupEntity)
    private correspondenceGroupRepository: Repository<CorrespondenceGroupEntity>,
    private getCorrespondenceGroupService: GetCorrespondenceGroupService,
    private editCorrespondenceGroupElasticService: EditCorrespondenceGroupElasticService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  @Transactional()
  async updateGroupOrFail(groupId: string, data: UpdateCorrespondenceGroupInterface) {
    await this.permissionAccessService.validateToEditOrDelete(
      { entityId: groupId, entityType: PermissionEntityType.CORRESPONDENCE_GROUP },
      true,
    );

    const group = await this.getCorrespondenceGroupService.getGroupOrFail(groupId);

    const dbUpdateOptions: TypeormUpdateEntity<CorrespondenceGroupEntity> = {};
    if (data.name) dbUpdateOptions.name = data.name;
    if (data.description) dbUpdateOptions.description = data.description;
    if (data.isPrivate !== undefined) dbUpdateOptions.isPrivate = data.isPrivate;

    await Promise.all([
      this.correspondenceGroupRepository.update(group.id, dbUpdateOptions),
      this.editCorrespondenceGroupElasticService.elasticUpdateGroupIndexOrFail(group.id, data),
    ]);
  }
}
