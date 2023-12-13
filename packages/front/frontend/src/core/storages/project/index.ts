import type { PaginatedEntities } from "@app/kit";
import { emptyPaginatedEntities, entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { ProjectsStatus } from "@app/shared-enums";

import { paginatedProjectsDecoder, ProjectEntity } from "core/entities/project/project";
import { ProjectDetailEntity } from "core/entities/project/projectDetail";
import { IdEntity } from "core/entities/id";
import { FileEntity } from "core/entities/file";
import { arrayOfPermissionEntitiesDecoder, PermissionEntity } from "core/entities/permission/permision";
import { arrayOfChangeFeedEventEntities } from "core/entities/change-feed";

import { updateFileRequest } from "core/storages/_common/updateFile";
import { IntlDateStorage } from "core/storages/intl-date";
import { ProfileStorage } from "core/storages/profile/profile";

import { ProjectsListFiltersEntity } from "./entities/Filter";
import { EditProjectEntity } from "./entities/EditProject";
import { DeleteProjectEntity } from "./entities/DeleteProject";

@Service()
export class ProjectStorage extends Storage {
  static token = "ProjectStorage";

  constructor() {
    super();
    this.initStorage(ProjectStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;

  @Inject() private profileStorage!: ProfileStorage;

  @observable projects = emptyPaginatedEntities as PaginatedEntities<ProjectEntity>;
  @observable projectDetail: ProjectDetailEntity | null = null;

  @action loadProjects = async (page: number, filterEntity: ProjectsListFiltersEntity) => {
    try {
      const projects = await this.requestManager.createRequest({
        url: "/projects",
        method: METHODS.GET,
        serverDataEntityDecoder: paginatedProjectsDecoder,
      })({ body: { page, perPage: 20, ...filterEntity.apiReady } });
      const intlDate = this.intlDateStorage.getIntlDate();
      projects.items.forEach((project) => project.configure(intlDate, this.profileStorage.user));
      if (page === 1) {
        this.projects.items = projects.items;
      } else {
        this.projects.items.push(...projects.items);
      }

      this.projects.pagination = projects.pagination;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadProjectDetail = async (projectId: string) => {
    try {
      const [projectDetail, { array: permissions }, { array: changeFeedEvents }] = await Promise.all([
        this.requestManager.createRequest({
          url: "/projects/{projectId}",
          method: METHODS.GET,
          serverDataEntityDecoder: ProjectDetailEntity,
        })({ urlParams: { projectId } }),
        this.requestManager.createRequest({
          url: "/projects/{projectId}/members",
          method: METHODS.GET,
          serverDataEntityDecoder: arrayOfPermissionEntitiesDecoder,
          responseDataFieldPath: ["list"],
        })({ urlParams: { projectId } }),
        this.requestManager.createRequest({
          url: "/change-feed/project/{projectId}",
          method: METHODS.GET,
          serverDataEntityDecoder: arrayOfChangeFeedEventEntities,
          responseDataFieldPath: ["list"],
        })({ urlParams: { projectId } }),
      ]);
      projectDetail.changeFeedEvents = changeFeedEvents;
      projectDetail.permissions = permissions;
      projectDetail.configure(this.intlDateStorage.getIntlDate(), this.profileStorage.user);
      projectDetail.goals.forEach((goal) => goal.timepoints.forEach((timepoint) => timepoint.configure(this.intlDateStorage.getIntlDate())));
      this.projectDetail = projectDetail;

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createProject = async (entity: EditProjectEntity) => {
    try {
      const result = await this.requestManager.createRequest({
        url: "/projects",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ body: entity.apiReady });

      const previewResult = await updateFileRequest(null, entity.preview, {
        uploadFile: (body) =>
          this.requestManager.createRequest({
            url: "/projects/{id}/preview",
            method: METHODS.POST,
            serverDataEntityDecoder: FileEntity,
          })({ urlParams: { id: result.id }, body }),
      });

      return { success: true, projectId: result.id, previewResult } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateProject = async (entity: EditProjectEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/projects/{id}",
        method: METHODS.PATCH,
      })({ body: entity.apiReady, urlParams: { id: entity.project!.id } });
      const previewResult = await updateFileRequest(entity.project!.preview, entity.preview, {
        uploadFile: (body) =>
          this.requestManager.createRequest({
            url: "/projects/{id}/preview",
            method: METHODS.POST,
            serverDataEntityDecoder: FileEntity,
          })({ urlParams: { id: entity.project!.id }, body, progressReceiver: entity.preview?.setProgress }),
        deleteFile: () =>
          this.requestManager.createRequest({ url: "/projects/{id}/preview", method: METHODS.DELETE })({
            urlParams: { id: entity.project!.id },
          }),
      });
      return { success: true, previewResult } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action moveProjectToCompletedStatus = async (id: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/projects/{id}/complete",
        method: METHODS.POST,
      })({ urlParams: { id } });
      this.projectDetail!.setCanMoveToCompletedStatus(false);
      this.projectDetail!.setStatus(ProjectsStatus.COMPLETED);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteProject = async (id: string, entity: DeleteProjectEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/projects/{id}",
        method: METHODS.DELETE,
      })({ urlParams: { id }, body: entity.apiReady });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action setFavourite = async (projectId: string, favourite: boolean) => {
    const projectInList = entityGetter(this.projects.items, projectId, "id");

    try {
      await this.requestManager.createRequest({
        url: "/projects/favourites/{projectId}",
        method: favourite ? METHODS.POST : METHODS.DELETE,
      })({ urlParams: { projectId } });
      if (projectInList) projectInList.entity.setFavourite(favourite);
      if (this.projectDetail?.id === projectId) this.projectDetail.setFavourite(favourite);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createPermission = async (entity: EditProjectEntity, permission: PermissionEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/projects/{projectId}/members",
        method: METHODS.POST,
      })({ urlParams: { projectId: entity.project!.id }, body: permission.apiReady });
      this.projectDetail!.permissions.push(permission);
      entity.permissions.push(permission);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deletePermission = async (entity: EditProjectEntity, userId: string) => {
    const permissionIndex = entity.permissions.findIndex((permission) => permission.user.id === userId);
    if (permissionIndex === -1) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/projects/{projectId}/members",
        method: METHODS.DELETE,
      })({ urlParams: { projectId: entity.project!.id }, body: { userId } });
      this.projectDetail!.permissions.splice(permissionIndex, 1);
      entity.permissions.splice(permissionIndex, 1);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action editPermission = async (entity: EditProjectEntity, permission: PermissionEntity) => {
    const permissionIndex = entity.permissions.findIndex(
      (originalPermission) => originalPermission.user.id === permission.user.id,
    );
    if (permissionIndex === -1) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/projects/{projectId}/members",
        method: METHODS.PATCH,
      })({ urlParams: { projectId: entity.project!.id }, body: permission.apiReady });
      this.projectDetail!.permissions[permissionIndex] = permission;
      entity.permissions[permissionIndex] = permission;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
