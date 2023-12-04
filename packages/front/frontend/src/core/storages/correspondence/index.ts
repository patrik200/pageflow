import { entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { CorrespondenceStatus } from "@app/shared-enums";

import { CorrespondenceGroupsAndCorrespondencesEntity } from "core/entities/correspondence/correspondenceGroupsAndCorrespondences";
import { IdEntity } from "core/entities/id";
import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";
import { PermissionEntity } from "core/entities/permission/permision";
import { arrayOfChangeFeedEventEntities } from "core/entities/change-feed";

import { IntlDateStorage } from "core/storages/intl-date";
import { ProfileStorage } from "core/storages/profile/profile";

import { CorrespondenceFilterEntity } from "./entities/correspondence/CorrespondenceFilter";
import { EditCorrespondenceGroupEntity } from "./entities/correspondence/EditGroup";
import { EditCorrespondenceEntity } from "./entities/correspondence/EditCorrespondence";

@Service()
export class CorrespondenceStorage extends Storage {
  static token = "CorrespondenceStorage";

  constructor() {
    super();
    this.initStorage(CorrespondenceStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;
  @Inject() private profileStorage!: ProfileStorage;

  @observable filter!: CorrespondenceFilterEntity;
  @observable groupsAndCorrespondences!: CorrespondenceGroupsAndCorrespondencesEntity;
  @observable correspondenceDetail: CorrespondenceEntity | null = null;

  @action initEmptyFilter() {
    this.filter = CorrespondenceFilterEntity.buildEmpty();
  }

  @action initProjectFilter(projectId: string) {
    this.filter = CorrespondenceFilterEntity.buildForProject(projectId);
  }

  @action initList() {
    this.groupsAndCorrespondences = CorrespondenceGroupsAndCorrespondencesEntity.buildEmpty();
  }

  @action getGroupsAndCorrespondences = async (filter: CorrespondenceFilterEntity) => {
    try {
      const results = await this.requestManager.createRequest({
        url: "/correspondences",
        method: METHODS.POST,
        serverDataEntityDecoder: CorrespondenceGroupsAndCorrespondencesEntity,
      })({ body: filter.apiReady });
      results.configure(this.intlDateStorage.getIntlDate(), this.profileStorage.user);
      return { success: true, results } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadGroupsAndCorrespondences = async () => {
    const result = await this.getGroupsAndCorrespondences(this.filter);
    if (result.success) this.groupsAndCorrespondences = result.results;
    return result;
  };

  @action loadCorrespondence = async (correspondenceId: string) => {
    try {
      const [correspondence, { array: changeFeedEvents }] = await Promise.all([
        this.requestManager.createRequest({
          url: "/correspondences/correspondence/{correspondenceId}",
          method: METHODS.GET,
          serverDataEntityDecoder: CorrespondenceEntity,
        })({ urlParams: { correspondenceId } }),
        this.requestManager.createRequest({
          url: "/change-feed/correspondence/{correspondenceId}",
          method: METHODS.GET,
          serverDataEntityDecoder: arrayOfChangeFeedEventEntities,
          responseDataFieldPath: ["list"],
        })({ urlParams: { correspondenceId } }),
      ]);
      correspondence.changeFeedEvents = changeFeedEvents;
      correspondence.configure(this.intlDateStorage.getIntlDate(), this.profileStorage.user);
      this.correspondenceDetail = correspondence;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createGroup = async (entity: EditCorrespondenceGroupEntity) => {
    try {
      const { id } = await this.requestManager.createRequest({
        url: "/correspondences/correspondence-group",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ body: entity.apiCreateReady });
      return { success: true, id } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createCorrespondence = async (entity: EditCorrespondenceEntity) => {
    try {
      const { id } = await this.requestManager.createRequest({
        url: "/correspondences/correspondence",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ body: entity.apiCreateReady });
      return { success: true, id } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteGroup = async (groupId: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence-group/{groupId}",
        method: METHODS.DELETE,
      })({ urlParams: { groupId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteCorrespondence = async (correspondenceId: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence/{correspondenceId}",
        method: METHODS.DELETE,
      })({ urlParams: { correspondenceId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateGroup = async (entity: EditCorrespondenceGroupEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence-group/{groupId}",
        method: METHODS.PATCH,
      })({ body: entity.apiUpdateReady, urlParams: { groupId: entity.options.id! } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateCorrespondence = async (entity: EditCorrespondenceEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence/{correspondenceId}",
        method: METHODS.PATCH,
      })({ body: entity.apiUpdateReady, urlParams: { correspondenceId: entity.options.id! } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action moveGroup = async (sourceGroupId: string, targetGroupId: string | null) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence-group/{sourceGroupId}/move/{targetGroupId}",
        method: METHODS.POST,
      })({ urlParams: { sourceGroupId, targetGroupId: targetGroupId ?? "" } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action moveCorrespondence = async (sourceCorrespondenceId: string, targetGroupId: string | null) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence/{sourceCorrespondenceId}/move/{targetGroupId}",
        method: METHODS.POST,
      })({ urlParams: { sourceCorrespondenceId, targetGroupId: targetGroupId ?? "" } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action setCorrespondenceFavourite = async (correspondenceId: string, favourite: boolean) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/favourites/correspondence/{correspondenceId}",
        method: favourite ? METHODS.POST : METHODS.DELETE,
      })({ urlParams: { correspondenceId } });
      if (this.groupsAndCorrespondences) {
        const correspondenceInList = entityGetter(
          this.groupsAndCorrespondences.correspondences,
          correspondenceId,
          "id",
        );
        if (correspondenceInList) correspondenceInList.entity.setFavourite(favourite);
      }
      if (this.correspondenceDetail?.id === correspondenceId) this.correspondenceDetail.setFavourite(favourite);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action setGroupFavourite = async (groupId: string, favourite: boolean) => {
    const group = entityGetter(this.groupsAndCorrespondences.correspondenceGroups, groupId, "id");
    if (!group) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/correspondences/favourites/correspondence-group/{groupId}",
        method: favourite ? METHODS.POST : METHODS.DELETE,
      })({ urlParams: { groupId } });
      group.entity.setFavourite(favourite);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action archive = async () => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence/{correspondenceId}/archive",
        method: METHODS.POST,
      })({ urlParams: { correspondenceId: this.correspondenceDetail!.id } });
      this.correspondenceDetail!.setCanArchive(false);
      this.correspondenceDetail!.setCanActive(true);
      this.correspondenceDetail!.setStatus(CorrespondenceStatus.ARCHIVE);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action active = async () => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence/{correspondenceId}/active",
        method: METHODS.POST,
      })({ urlParams: { correspondenceId: this.correspondenceDetail!.id } });
      this.correspondenceDetail!.setCanActive(false);
      this.correspondenceDetail!.setCanArchive(true);
      this.correspondenceDetail!.setStatus(CorrespondenceStatus.ACTIVE);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createCorrespondencePermission = async (entity: EditCorrespondenceEntity, permission: PermissionEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence/{correspondenceId}/permissions",
        method: METHODS.POST,
      })({ urlParams: { correspondenceId: entity.options.id! }, body: permission.apiReady });
      this.correspondenceDetail!.permissions.push(permission);
      entity.permissions.push(permission);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteCorrespondencePermission = async (entity: EditCorrespondenceEntity, userId: string) => {
    const permissionIndex = entity.permissions.findIndex((permission) => permission.user.id === userId);
    if (permissionIndex === -1) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence/{correspondenceId}/permissions",
        method: METHODS.DELETE,
      })({ urlParams: { correspondenceId: entity.options.id! }, body: { userId } });
      this.correspondenceDetail!.permissions.splice(permissionIndex, 1);
      entity.permissions.splice(permissionIndex, 1);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action editCorrespondencePermission = async (entity: EditCorrespondenceEntity, permission: PermissionEntity) => {
    const permissionIndex = entity.permissions.findIndex(
      (originalPermission) => originalPermission.user.id === permission.user.id,
    );
    if (permissionIndex === -1) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence/{correspondenceId}/permissions",
        method: METHODS.PATCH,
      })({ urlParams: { correspondenceId: entity.options.id! }, body: permission.apiReady });
      this.correspondenceDetail!.permissions[permissionIndex] = permission;
      entity.permissions[permissionIndex] = permission;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createCorrespondenceGroupPermission = async (
    entity: EditCorrespondenceGroupEntity,
    permission: PermissionEntity,
  ) => {
    const group = entityGetter(this.groupsAndCorrespondences.correspondenceGroups, entity.options.id!, "id");
    if (!group) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence-group/{groupId}/permissions",
        method: METHODS.POST,
      })({ urlParams: { groupId: entity.options.id! }, body: permission.apiReady });
      group.entity.permissions.push(permission);
      entity.permissions.push(permission);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteCorrespondenceGroupPermission = async (entity: EditCorrespondenceGroupEntity, userId: string) => {
    const permissionIndex = entity.permissions.findIndex((permission) => permission.user.id === userId);
    if (permissionIndex === -1) return { success: false, error: false } as const;

    const group = entityGetter(this.groupsAndCorrespondences.correspondenceGroups, entity.options.id!, "id");
    if (!group) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence-group/{groupId}/permissions",
        method: METHODS.DELETE,
      })({ urlParams: { groupId: entity.options.id! }, body: { userId } });
      group.entity.permissions.splice(permissionIndex, 1);
      entity.permissions.splice(permissionIndex, 1);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action editCorrespondenceGroupPermission = async (
    entity: EditCorrespondenceGroupEntity,
    permission: PermissionEntity,
  ) => {
    const permissionIndex = entity.permissions.findIndex(
      (originalPermission) => originalPermission.user.id === permission.user.id,
    );
    if (permissionIndex === -1) return { success: false, error: false } as const;

    const group = entityGetter(this.groupsAndCorrespondences.correspondenceGroups, entity.options.id!, "id");
    if (!group) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/correspondences/correspondence-group/{groupId}/permissions",
        method: METHODS.PATCH,
      })({ urlParams: { groupId: entity.options.id! }, body: permission.apiReady });
      group.entity.permissions[permissionIndex] = permission;
      entity.permissions[permissionIndex] = permission;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
