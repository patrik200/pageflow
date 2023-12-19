import { PermissionEntityType } from "@app/shared-enums";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";

import { getCurrentUser } from "modules/auth";
import { PermissionAccessService, PermissionSelectOptions } from "modules/permissions";

import { GetCorrespondenceIsFavouritesService } from "./favourites";

@Injectable()
export class GetCorrespondenceService {
  constructor(
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    @InjectRepository(CorrespondenceGroupEntity)
    private correspondenceGroupRepository: Repository<CorrespondenceGroupEntity>,
    private getCorrespondenceIsFavouritesService: GetCorrespondenceIsFavouritesService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getCorrespondenceOrFail(
    correspondenceId: string,
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
      loadDependsOnDocument?: boolean;
      loadDependsOnDocumentAuthor?: boolean;
      loadRevisions?: boolean;
      loadContractor?: boolean;
      loadContractorLogo?: boolean;
      loadRootGroup?: boolean;
      loadRootGroupParentDocument?: boolean;
      loadRootGroupParentProject?: boolean;
      loadParentGroup?: boolean;
      loadClient?: boolean;
    } = {},
  ) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToRead(
        { entityId: correspondenceId, entityType: PermissionEntityType.CORRESPONDENCE },
        true,
      );
    }

    const findOptions: FindOptionsWhere<CorrespondenceEntity> = { id: correspondenceId };
    findOptions.client = { id: getCurrentUser().clientId };

    const correspondence = await this.correspondenceRepository.findOneOrFail({
      where: findOptions,
      relations: {
        client: options.loadClient,
        author: {
          avatar: options.loadAuthorAvatar,
        },
        dependsOnDocuments: options.loadDependsOnDocument
          ? {
              author: options.loadDependsOnDocumentAuthor,
            }
          : false,
        revisions: options.loadRevisions,
        contractor: options.loadContractor
          ? {
              logo: options.loadContractorLogo,
            }
          : false,
        rootGroup: options.loadRootGroup
          ? {
              parentDocument: options.loadRootGroupParentDocument,
              parentProject: options.loadRootGroupParentProject,
            }
          : false,
        parentGroup: options.loadParentGroup,
        attributeValues: loadAttributes ? { attributeType: true } : false,
      },
    });

    correspondence.calculateAllCans(getCurrentUser());

    await Promise.all([
      correspondence.parentGroup?.calculateGroupsPath(this.correspondenceGroupRepository),
      loadFavourites && this.getCorrespondenceIsFavouritesService.loadCorrespondenceIsFavourite(correspondence),
      loadPermissions &&
        this.permissionAccessService.loadPermissions(
          { entityId: correspondence.id, entityType: PermissionEntityType.CORRESPONDENCE },
          correspondence,
          permissionSelectOptions,
        ),
    ]);

    return correspondence;
  }
}
