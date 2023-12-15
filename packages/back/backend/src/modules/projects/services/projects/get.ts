import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { PermissionEntityType } from "@app/shared-enums";

import { ProjectEntity } from "entities/Project";

import { getCurrentUser } from "modules/auth";
import { GetActiveTicketsCountService } from "modules/tickets";
import { PermissionAccessService } from "modules/permissions";
import { GetGoalsListService } from "modules/goals";

import { GetProjectIsFavouritesService } from "../favorite/get-is-favorite";

@Injectable()
export class GetProjectService {
  constructor(
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    @Inject(forwardRef(() => GetActiveTicketsCountService))
    private getActiveTicketsCountService: GetActiveTicketsCountService,
    private getProjectIsFavouritesService: GetProjectIsFavouritesService,
    private getGoalsListService: GetGoalsListService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  async getProjectOrFail(
    projectId: string,
    {
      unsafeIgnoreClient,
      loadActiveTicketsCount,
      loadFavourites,
      checkPermissions = true,
      loadPermissions,
      ...options
    }: {
      unsafeIgnoreClient?: boolean;
      loadActiveTicketsCount?: boolean;
      loadFavourites?: boolean;
      checkPermissions?: boolean;
      loadPermissions?: boolean;
      loadAuthorAvatar?: boolean;
      loadResponsibleAvatar?: boolean;
      loadCorrespondenceRootGroup?: boolean;
      loadDocumentRootGroup?: boolean;
      loadPreview?: boolean;
      loadContractor?: boolean;
      loadContractorLogo?: boolean;
      loadTicketBoards?: boolean;
      loadClient?: boolean;
      loadGoals?: boolean;
    } = {},
  ) {
    if (checkPermissions) {
      await this.permissionAccessService.validateToRead(
        { entityId: projectId, entityType: PermissionEntityType.PROJECT },
        true,
      );
    }

    const where: FindOptionsWhere<ProjectEntity> = { id: projectId };

    if (!unsafeIgnoreClient) where.client = { id: getCurrentUser().clientId };

    const project = await this.projectRepository.findOneOrFail({
      where,
      relations: {
        client: options.loadClient,
        author: {
          avatar: options.loadAuthorAvatar,
        },
        responsible: {
          avatar: options.loadResponsibleAvatar,
        },
        correspondenceRootGroup: options.loadCorrespondenceRootGroup,
        documentRootGroup: options.loadDocumentRootGroup,
        ticketBoards: options.loadTicketBoards,
        preview: options.loadPreview,
        contractor: options.loadContractor
          ? {
              logo: options.loadContractorLogo,
            }
          : false,
      },
    });

    if (!unsafeIgnoreClient) project.calculateAllCans(getCurrentUser());

    await Promise.all([
      loadFavourites && this.getProjectIsFavouritesService.loadProjectIsFavourite(project),
      loadActiveTicketsCount &&
        this.getActiveTicketsCountService
          .unsafeGetActiveTicketsCountForProject(project.id)
          .then((activeTicketsCount) => (project.activeTicketsCount = activeTicketsCount)),
      loadPermissions &&
        this.permissionAccessService.loadPermissions(
          { entityId: project.id, entityType: PermissionEntityType.PROJECT },
          project,
          { loadUser: true, unsafeIgnoreClient },
        ),
    ]);

    return project;
  }
}
