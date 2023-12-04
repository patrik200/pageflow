import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentGroupEntity } from "entities/Document/Group/group";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

import { GetDocumentGroupIsFavouritesService } from "./favourites";

@Injectable()
export class GetDocumentGroupService {
  constructor(
    @InjectRepository(DocumentGroupEntity) private documentGroupRepository: Repository<DocumentGroupEntity>,
    private getDocumentGroupIsFavouritesService: GetDocumentGroupIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getGroupOrFail(
    groupId: string,
    {
      loadFavourites,
      checkPermissions = true,
      loadPermissions,
      ...options
    }: {
      loadFavourites?: boolean;
      checkPermissions?: boolean;
      loadPermissions?: boolean;
      loadRootGroup?: boolean;
      loadParentGroup?: boolean;
      loadChildrenGroups?: boolean;
      loadChildrenDocuments?: boolean;
    } = {},
  ) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToRead(
        { entityId: groupId, entityType: PermissionEntityType.DOCUMENT_GROUP },
        true,
      );
    }

    const group = await this.documentGroupRepository.findOneOrFail({
      where: { client: { id: getCurrentUser().clientId }, id: groupId },
      relations: {
        rootGroup: options.loadRootGroup,
        parentGroup: options.loadParentGroup,
        childrenGroups: options.loadChildrenGroups,
        childrenDocuments: options.loadChildrenDocuments,
      },
    });

    await Promise.all([
      loadFavourites && this.getDocumentGroupIsFavouritesService.loadGroupIsFavourite(group),
      loadPermissions &&
        this.permissionAccessService.loadPermissions(
          { entityId: group.id, entityType: PermissionEntityType.DOCUMENT_GROUP },
          group,
          { loadUser: true },
        ),
    ]);

    return group;
  }
}
