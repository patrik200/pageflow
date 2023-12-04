import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";
import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentRevisionResponsibleUserFlowRowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService } from "modules/permissions";

import { GetDocumentRevisionIsFavouritesService } from "../favourites/get-is-favourite";

@Injectable()
export class GetDocumentRevisionService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    @InjectRepository(DocumentGroupEntity) private groupRepository: Repository<DocumentGroupEntity>,
    private getIsFavouritesService: GetDocumentRevisionIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getRevisionOrFail(
    revisionId: string,
    {
      calculateParentGroupPath,
      loadFavourites,
      checkPermissions = true,
      ...options
    }: {
      calculateParentGroupPath?: boolean;
      loadFavourites?: boolean;
      loadReturnsCount?: boolean;
      checkPermissions?: boolean;
      loadDocumentParentGroup?: boolean;
      loadDocumentRootGroup?: boolean;
      loadDocumentRootGroupParentProject?: boolean;
      loadFiles?: boolean;
      loadAuthorAvatar?: boolean;
      loadDocumentAuthor?: boolean;
      loadDocumentResponsibleUser?: boolean;
      loadResponsibleUserFlowApprovingUserAvatar?: boolean;
      loadResponsibleUserFlowApprovingReviewerUserAvatar?: boolean;
      loadResponsibleUserFlowApprovingRowsUsersUserAvatar?: boolean;
      loadResponsibleUserFlowApprovingRowsUsersFiles?: boolean;
    } = {},
  ) {
    const currentUser = getCurrentUser();

    const revision = await this.revisionsRepository.findOneOrFail({
      where: { id: revisionId, document: { client: { id: currentUser.clientId } } },
      relations: {
        document: {
          client: true,
          parentGroup: calculateParentGroupPath || options.loadDocumentParentGroup,
          rootGroup: options.loadDocumentRootGroup
            ? {
                parentProject: options.loadDocumentRootGroupParentProject,
              }
            : false,
          author: options.loadDocumentAuthor,
          responsibleUser: options.loadDocumentResponsibleUser,
        },
        author: {
          avatar: options.loadAuthorAvatar,
        },
        comments: true,
        responsibleUserApproving: {
          user: {
            avatar: options.loadResponsibleUserFlowApprovingUserAvatar,
          },
        },
        responsibleUserFlowApproving: {
          rows: {
            users: {
              user: {
                avatar: options.loadResponsibleUserFlowApprovingRowsUsersUserAvatar,
              },
              files: options.loadResponsibleUserFlowApprovingRowsUsersFiles ? { file: true } : false,
            },
          },
          reviewer: {
            user: {
              avatar: options.loadResponsibleUserFlowApprovingReviewerUserAvatar,
            },
          },
        },
        returnCounts: options.loadReturnsCount ? { returnCode: true } : false,
        files: options.loadFiles ? { file: true } : false,
      },
    });

    if (revision.responsibleUserFlowApproving !== null) {
      const revisionUserFlowRowInverseNecessary = {
        userFlow: {
          revision: {
            statusChangeDate: revision.statusChangeDate,
          },
          deadlineDaysIncludeWeekends: revision.responsibleUserFlowApproving.deadlineDaysIncludeWeekends,
        },
      } as DocumentRevisionResponsibleUserFlowRowEntity;

      revision.responsibleUserFlowApproving.revision = revisionUserFlowRowInverseNecessary.userFlow.revision;
      for (const row of revision.responsibleUserFlowApproving.rows) {
        row.userFlow = revisionUserFlowRowInverseNecessary.userFlow;
        for (const rowUser of row.users) {
          rowUser.row = revisionUserFlowRowInverseNecessary;
        }
      }
    }

    if (checkPermissions)
      await this.permissionAccessService.validateToRead(
        { entityId: revision.document.id, entityType: PermissionEntityType.DOCUMENT },
        true,
      );

    revision.calculateAllCans(currentUser);
    revision.responsibleUserFlowApproving?.rows.sort((a, b) => a.index - b.index);
    revision.responsibleUserFlowApproving?.rows.forEach((row) => row.users.sort((a, b) => a.index - b.index));
    revision.returnCounts?.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    await Promise.all([
      calculateParentGroupPath && revision.document.parentGroup?.calculateGroupsPath(this.groupRepository),
      loadFavourites &&
        (async () => (revision.favourite = await this.getIsFavouritesService.getRevisionIsFavourite(revision.id)))(),
    ]);

    return revision;
  }
}
