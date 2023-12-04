import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, In, Repository } from "typeorm";
import { convertSortingToElasticSearch, ElasticService, injectPaginationToFindAndCountResult } from "@app/back-kit";
import { PaginationQueryInterface } from "@app/kit";
import { PermissionEntityType, ProjectsStatus } from "@app/shared-enums";
import { isNil } from "@worksolutions/utils";

import { ProjectEntity } from "entities/Project";

import { getCurrentUser } from "modules/auth";
import { GetActiveTicketsCountService } from "modules/tickets";
import { PermissionAccessService } from "modules/permissions";

import { GetProjectIsFavouritesService } from "../favorite/get-is-favorite";
import type { ProjectSorting } from "../../types";

interface ProjectsSearchParams {
  pagination: PaginationQueryInterface;
  search?: string;
  sorting?: ProjectSorting;
  showArchived?: boolean;
  responsibleUser?: string | null;
}

@Injectable()
export class GetProjectListService {
  constructor(
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    private elasticService: ElasticService,
    private getProjectIsFavouritesService: GetProjectIsFavouritesService,
    @Inject(forwardRef(() => GetActiveTicketsCountService))
    private getActiveTicketsCountService: GetActiveTicketsCountService,
    @Inject(forwardRef(() => PermissionAccessService)) private permissionAccessService: PermissionAccessService,
  ) {}

  private getHasSearch(searchParams: ProjectsSearchParams) {
    return !isNil(searchParams.search) && searchParams.search !== "";
  }

  async getProjectsListOrFail(
    searchParams: ProjectsSearchParams,
    {
      loadTickets,
      loadFavourites,
      ...options
    }: {
      loadTickets?: boolean;
      loadFavourites?: boolean;
      loadPreview?: boolean;
      loadResponsible?: boolean;
      loadResponsibleAvatar?: boolean;
      loadContractor?: boolean;
      loadContractorLogo?: boolean;
      loadAuthor?: boolean;
      loadAuthorAvatar?: boolean;
    } = {},
  ) {
    const searchResults = await this.elasticService.searchQueryMatchOrFail<{
      clientId: string;
      isPrivate: boolean;
    }>(
      "projects",
      {
        query: {
          bool: {
            must: [
              { term: { clientId: getCurrentUser().clientId } },
              this.getHasSearch(searchParams)
                ? { multi_match: { query: searchParams.search!, fields: ["name", "description"] } }
                : undefined!,
              searchParams.responsibleUser ? { term: { responsibleId: searchParams.responsibleUser } } : undefined!,
              searchParams.showArchived
                ? undefined!
                : { terms: { status: [ProjectsStatus.IN_PROGRESS, ProjectsStatus.COMPLETED] } },
            ].filter(Boolean),
          },
        },
      },
      {
        pagination: searchParams.pagination,
        sorting: convertSortingToElasticSearch(searchParams.sorting),
      },
    );

    const projectIdsWithPermissions = (
      await Promise.all(
        searchResults.hits.map(async ({ _id: projectId }) => {
          const hasPermission = await this.permissionAccessService.validateToRead(
            { entityId: projectId, entityType: PermissionEntityType.PROJECT },
            false,
          );

          return hasPermission ? projectId : undefined!;
        }),
      )
    ).filter(Boolean);

    const unsortedProjects = await this.projectRepository.find({
      where: { id: In(projectIdsWithPermissions) },
      relations: {
        preview: options.loadPreview,
        responsible: options.loadResponsible
          ? {
              avatar: options.loadResponsibleAvatar,
            }
          : false,
        contractor: options.loadContractor
          ? {
              logo: options.loadContractorLogo,
            }
          : false,
        author: options.loadAuthor
          ? {
              avatar: options.loadAuthorAvatar,
            }
          : false,
      },
    });

    const projects = searchResults.hits.map((hit) => unsortedProjects.find((project) => project.id === hit._id)!);

    await Promise.all([
      loadTickets &&
        Promise.all(
          projects.map((project) => this.getActiveTicketsCountService.unsafeLoadActiveTicketsCountForBoard(project)),
        ),
      loadFavourites &&
        Promise.all(projects.map((project) => this.getProjectIsFavouritesService.loadProjectIsFavourite(project))),
    ]);

    return injectPaginationToFindAndCountResult(searchParams.pagination, [projects, searchResults.total]);
  }

  async dangerGetProjectsList(findOptions: FindManyOptions<ProjectEntity>) {
    return await this.projectRepository.find(findOptions);
  }
}
