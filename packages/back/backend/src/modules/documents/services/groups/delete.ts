import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentGroupEntity } from "entities/Document/Group/group";

import { DeletePermissionService, PermissionAccessService } from "modules/permissions";

import { DeleteDocumentService } from "../documents/delete";
import { RemoveDocumentGroupFavouritesService } from "./favourites";
import { DeleteDocumentGroupsElasticService } from "./elastic";
import { GetDocumentGroupService } from "./get";

@Injectable()
export class DeleteDocumentGroupService {
  constructor(
    @InjectRepository(DocumentGroupEntity) private documentGroupRepository: Repository<DocumentGroupEntity>,
    private getDocumentGroupService: GetDocumentGroupService,
    private removeDocumentGroupFavouritesService: RemoveDocumentGroupFavouritesService,
    private deleteDocumentGroupsElasticService: DeleteDocumentGroupsElasticService,
    private deleteDocumentService: DeleteDocumentService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
    @Inject(forwardRef(() => DeletePermissionService)) private deletePermissionService: DeletePermissionService,
  ) {}

  @Transactional()
  async deleteGroupOrFail(groupId: string, { checkPermissions = true }: { checkPermissions?: boolean } = {}) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToEditOrDelete(
        { entityId: groupId, entityType: PermissionEntityType.DOCUMENT_GROUP },
        true,
      );
    }

    const group = await this.getDocumentGroupService.getGroupOrFail(groupId, {
      checkPermissions,
      loadChildrenGroups: true,
      loadChildrenDocuments: true,
    });

    await Promise.all([
      ...group.childrenGroups.map(({ id }) => this.deleteGroupOrFail(id, { checkPermissions: false })),
      ...group.childrenDocuments.map(({ id }) =>
        this.deleteDocumentService.deleteDocumentOrFail(id, { checkPermissions: false }),
      ),
      this.removeDocumentGroupFavouritesService.removeGroupFavouriteOrFail(group.id, { forAllUsers: true }),
      this.deleteDocumentGroupsElasticService.elasticDeleteGroupIndexOrFail(group.id),
    ]);

    await this.deletePermissionService.deleteAllPermissionsOrFail({
      entityId: group.id,
      entityType: PermissionEntityType.DOCUMENT_GROUP,
    });

    await this.documentGroupRepository.delete(group.id);
  }
}
