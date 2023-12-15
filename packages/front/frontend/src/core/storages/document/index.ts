import { action, observable } from "mobx";
import { Inject, Service } from "typedi";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { entityGetter, METHODS } from "@app/kit";
import { DocumentStatus } from "@app/shared-enums";

import { DocumentEntity } from "core/entities/document/document";
import { DocumentGroupsAndDocumentsEntity } from "core/entities/document/documentGroupsAndDocuments";
import { IdEntity } from "core/entities/id";
import { PermissionEntity } from "core/entities/permission/permision";
import { arrayOfChangeFeedEventEntities } from "core/entities/change-feed";

import { IntlDateStorage } from "core/storages/intl-date";
import { ProfileStorage } from "core/storages/profile/profile";

import { DocumentFilterEntity } from "./entities/document/DocumentFilter";
import { EditDocumentEntity } from "./entities/document/EditDocument";
import { EditDocumentGroupEntity } from "./entities/document/EditGroup";

@Service()
export class DocumentStorage extends Storage {
  static token = "DocumentStorage";

  constructor() {
    super();
    this.initStorage(DocumentStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;
  @Inject() private profileStorage!: ProfileStorage;

  @observable filter!: DocumentFilterEntity;
  @observable groupsAndDocuments!: DocumentGroupsAndDocumentsEntity;
  @observable documentDetail: DocumentEntity | null = null;

  @action initProjectFilter(projectId: string) {
    this.filter = DocumentFilterEntity.buildForProject(projectId);
  }

  @action initList() {
    this.groupsAndDocuments = DocumentGroupsAndDocumentsEntity.buildEmpty();
  }

  @action getGroupsAndDocuments = async (filter: DocumentFilterEntity) => {
    try {
      const results = await this.requestManager.createRequest({
        url: "/documents",
        method: METHODS.POST,
        serverDataEntityDecoder: DocumentGroupsAndDocumentsEntity,
      })({ body: filter.apiReady });
      results.configure(this.intlDateStorage.getIntlDate(), this.profileStorage.user);
      return { success: true, results } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadGroupsAndDocuments = async () => {
    const result = await this.getGroupsAndDocuments(this.filter);
    if (result.success) this.groupsAndDocuments = result.results;
    return result;
  };

  @action loadDocument = async (documentId: string) => {
    try {
      const [document, { array: changeFeedEvents }] = await Promise.all([
        this.requestManager.createRequest({
          url: "/documents/document/{documentId}",
          method: METHODS.GET,
          serverDataEntityDecoder: DocumentEntity,
        })({ urlParams: { documentId } }),
        this.requestManager.createRequest({
          url: "/change-feed/document/{documentId}",
          method: METHODS.GET,
          serverDataEntityDecoder: arrayOfChangeFeedEventEntities,
          responseDataFieldPath: ["list"],
        })({ urlParams: { documentId } }),
      ]);
      document.changeFeedEvents = changeFeedEvents;
      document.configure(this.intlDateStorage.getIntlDate(), this.profileStorage.user);
      this.documentDetail = document;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createGroup = async (entity: EditDocumentGroupEntity) => {
    try {
      const { id } = await this.requestManager.createRequest({
        url: "/documents/document-group",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ body: entity.apiCreateReady });
      return { success: true, id } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createDocument = async (entity: EditDocumentEntity) => {
    try {
      const { id } = await this.requestManager.createRequest({
        url: "/documents/document",
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
        url: "/documents/document-group/{groupId}",
        method: METHODS.DELETE,
      })({ urlParams: { groupId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteDocument = async (documentId: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/documents/document/{documentId}",
        method: METHODS.DELETE,
      })({ urlParams: { documentId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateGroup = async (entity: EditDocumentGroupEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/documents/document-group/{groupId}",
        method: METHODS.PATCH,
      })({ body: entity.apiUpdateReady, urlParams: { groupId: entity.options.id! } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateDocument = async (entity: EditDocumentEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/documents/document/{documentId}",
        method: METHODS.PATCH,
      })({ body: entity.apiUpdateReady, urlParams: { documentId: entity.options.id! } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action moveGroup = async (sourceGroupId: string, targetGroupId: string | null) => {
    try {
      await this.requestManager.createRequest({
        url: "/documents/document-group/{sourceGroupId}/move/{targetGroupId}",
        method: METHODS.POST,
      })({ urlParams: { sourceGroupId, targetGroupId: targetGroupId ?? "" } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action moveDocument = async (sourceDocumentId: string, targetGroupId: string | null) => {
    try {
      await this.requestManager.createRequest({
        url: "/documents/document/{sourceDocumentId}/move/{targetGroupId}",
        method: METHODS.POST,
      })({ urlParams: { sourceDocumentId, targetGroupId: targetGroupId ?? "" } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action setDocumentFavourite = async (documentId: string, favourite: boolean) => {
    try {
      await this.requestManager.createRequest({
        url: "/documents/favourites/document/{documentId}",
        method: favourite ? METHODS.POST : METHODS.DELETE,
      })({ urlParams: { documentId } });
      if (this.groupsAndDocuments) {
        const documentInList = entityGetter(this.groupsAndDocuments.documents, documentId, "id");
        if (documentInList) documentInList.entity.setFavourite(favourite);
      }

      if (this.documentDetail?.id === documentId) this.documentDetail.setFavourite(favourite);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action setGroupFavourite = async (groupId: string, favourite: boolean) => {
    const group = entityGetter(this.groupsAndDocuments.documentGroups, groupId, "id");
    if (!group) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/documents/favourites/document-group/{groupId}",
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
        url: "/documents/document/{documentId}/archive",
        method: METHODS.POST,
      })({ urlParams: { documentId: this.documentDetail!.id } });
      this.documentDetail!.setCanArchive(false);
      this.documentDetail!.setCanActive(true);
      this.documentDetail!.setStatus(DocumentStatus.ARCHIVE);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action active = async () => {
    try {
      await this.requestManager.createRequest({
        url: "/documents/document/{documentId}/active",
        method: METHODS.POST,
      })({ urlParams: { documentId: this.documentDetail!.id } });
      this.documentDetail!.setCanActive(false);
      this.documentDetail!.setCanArchive(true);
      this.documentDetail!.setStatus(DocumentStatus.ACTIVE);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createDocumentPermission = async (entity: EditDocumentEntity, permission: PermissionEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/documents/document/{documentId}/permissions",
        method: METHODS.POST,
      })({ urlParams: { documentId: entity.options.id! }, body: permission.apiReady });
      this.documentDetail!.permissions.push(permission);
      entity.permissions.push(permission);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteDocumentPermission = async (entity: EditDocumentEntity, userId: string) => {
    const permissionIndex = entity.permissions.findIndex((permission) => permission.user.id === userId);
    if (permissionIndex === -1) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/documents/document/{documentId}/permissions",
        method: METHODS.DELETE,
      })({ urlParams: { documentId: entity.options.id! }, body: { userId } });
      this.documentDetail!.permissions.splice(permissionIndex, 1);
      entity.permissions.splice(permissionIndex, 1);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action editDocumentPermission = async (entity: EditDocumentEntity, permission: PermissionEntity) => {
    const permissionIndex = entity.permissions.findIndex(
      (originalPermission) => originalPermission.user.id === permission.user.id,
    );
    if (permissionIndex === -1) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/documents/document/{documentId}/permissions",
        method: METHODS.PATCH,
      })({ urlParams: { documentId: entity.options.id! }, body: permission.apiReady });
      this.documentDetail!.permissions[permissionIndex] = permission;
      entity.permissions[permissionIndex] = permission;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createDocumentGroupPermission = async (entity: EditDocumentGroupEntity, permission: PermissionEntity) => {
    const group = entityGetter(this.groupsAndDocuments.documentGroups, entity.options.id!, "id");
    if (!group) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/documents/document-group/{groupId}/permissions",
        method: METHODS.POST,
      })({ urlParams: { groupId: entity.options.id! }, body: permission.apiReady });
      group.entity.permissions.push(permission);
      entity.permissions.push(permission);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action deleteDocumentGroupPermission = async (entity: EditDocumentGroupEntity, userId: string) => {
    const permissionIndex = entity.permissions.findIndex((permission) => permission.user.id === userId);
    if (permissionIndex === -1) return { success: false, error: false } as const;

    const group = entityGetter(this.groupsAndDocuments.documentGroups, entity.options.id!, "id");
    if (!group) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/documents/document-group/{groupId}/permissions",
        method: METHODS.DELETE,
      })({ urlParams: { groupId: entity.options.id! }, body: { userId } });
      group.entity.permissions.splice(permissionIndex, 1);
      entity.permissions.splice(permissionIndex, 1);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action editDocumentGroupPermission = async (entity: EditDocumentGroupEntity, permission: PermissionEntity) => {
    const permissionIndex = entity.permissions.findIndex(
      (originalPermission) => originalPermission.user.id === permission.user.id,
    );
    if (permissionIndex === -1) return { success: false, error: false } as const;

    const group = entityGetter(this.groupsAndDocuments.documentGroups, entity.options.id!, "id");
    if (!group) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/documents/document-group/{groupId}/permissions",
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
