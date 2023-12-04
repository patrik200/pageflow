import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentEntity } from "entities/Document/Document";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService, PermissionSelectOptions } from "modules/permissions";

import { GetDocumentIsFavouritesService } from "./favourites";

@Injectable()
export class GetDocumentService {
  constructor(
    @InjectRepository(DocumentGroupEntity) private documentGroupRepository: Repository<DocumentGroupEntity>,
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
    private getDocumentIsFavouritesService: GetDocumentIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getDocumentOrFail(
    documentId: string,
    {
      loadFavourites,
      checkPermissions = true,
      loadPermissions = false,
      loadAttributes = false,
      permissionSelectOptions,
      ...options
    }: {
      loadFavourites?: boolean;
      loadPermissions?: boolean;
      loadAttributes?: boolean;
      permissionSelectOptions?: PermissionSelectOptions;
      checkPermissions?: boolean;
      loadAuthorAvatar?: boolean;
      loadRevisions?: boolean;
      loadResponsibleUser?: boolean;
      loadResponsibleUserAvatar?: boolean;
      loadResponsibleUserFlow?: boolean;
      loadResponsibleUserFlowRows?: boolean;
      loadResponsibleUserFlowRowsUsers?: boolean;
      loadResponsibleUserFlowRowsUsersUser?: boolean;
      loadResponsibleUserFlowRowsUsersUserAvatar?: boolean;
      loadType?: boolean;
      loadRootGroup?: boolean;
      loadRootGroupParentProject?: boolean;
      loadDependsOnCorrespondences?: boolean;
      loadDependsOnCorrespondencesAuthor?: boolean;
      loadCorrespondenceRootGroup?: boolean;
      loadClient?: boolean;
    } = {},
  ) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToRead(
        { entityId: documentId, entityType: PermissionEntityType.DOCUMENT },
        true,
      );
    }

    const currentUser = getCurrentUser();
    const document = await this.documentRepository.findOneOrFail({
      where: { id: documentId, client: { id: currentUser.clientId } },
      relations: {
        client: options.loadClient,
        parentGroup: true,
        author: {
          avatar: options.loadAuthorAvatar,
        },
        responsibleUser: options.loadResponsibleUser
          ? {
              avatar: options.loadResponsibleUserAvatar,
            }
          : false,
        responsibleUserFlow: options.loadResponsibleUserFlow
          ? {
              rows: options.loadResponsibleUserFlowRows
                ? {
                    users: options.loadResponsibleUserFlowRowsUsers
                      ? {
                          user: options.loadResponsibleUserFlowRowsUsersUser
                            ? {
                                avatar: options.loadResponsibleUserFlowRowsUsersUserAvatar,
                              }
                            : false,
                        }
                      : false,
                  }
                : false,
            }
          : false,
        revisions: options.loadRevisions,
        type: options.loadType,
        rootGroup: options.loadRootGroup
          ? {
              parentProject: options.loadRootGroupParentProject,
            }
          : false,
        dependsOnCorrespondences: options.loadDependsOnCorrespondences
          ? {
              author: options.loadDependsOnCorrespondencesAuthor,
            }
          : false,
        correspondenceRootGroup: options.loadCorrespondenceRootGroup,
        attributeValues: loadAttributes ? { attributeType: true } : false,
      },
    });

    document.calculateAllCans(currentUser);

    await Promise.all([
      document.parentGroup?.calculateGroupsPath(this.documentGroupRepository),
      loadFavourites && this.getDocumentIsFavouritesService.loadDocumentIsFavourite(document),
      loadPermissions &&
        this.permissionAccessService.loadPermissions(
          { entityId: document.id, entityType: PermissionEntityType.DOCUMENT },
          document,
          permissionSelectOptions,
        ),
    ]);

    return document;
  }
}
