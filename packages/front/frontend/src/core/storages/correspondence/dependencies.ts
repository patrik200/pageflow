import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { entityGetter, METHODS } from "@app/kit";
import { action, observable } from "mobx";
import { Inject, Service } from "typedi";

import { arrayOfDocumentEntitiesDecoder, DocumentEntity } from "core/entities/document/document";

import { IntlDateStorage } from "core/storages/intl-date";
import { ProfileStorage } from "core/storages/profile/profile";

@Service()
export class CorrespondenceDependenciesStorage extends Storage {
  static token = "CorrespondenceDependenciesStorage";

  constructor() {
    super();
    this.initStorage(CorrespondenceDependenciesStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;
  @Inject() private profileStorage!: ProfileStorage;

  @observable dependsOn: DocumentEntity[] = [];
  @observable dependsTo: DocumentEntity[] = [];

  getIsDependent(correspondenceId: string) {
    return this.dependsOn.some((correspondence) => correspondence.id === correspondenceId);
  }

  @action createDependency = async (correspondenceId: string, document: DocumentEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/{correspondenceId}/dependsOn/{documentId}",
        method: METHODS.POST,
      })({ urlParams: { documentId: document.id, correspondenceId } });

      this.dependsOn.push(document);

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action removeDependency = async (correspondenceId: string, documentId: string) => {
    const entity = entityGetter(this.dependsOn, documentId, "id");
    if (!entity) return { success: false, error: false } as const;
    try {
      await this.requestManager.createRequest({
        url: "/correspondences/{correspondenceId}/dependsOn/{documentId}",
        method: METHODS.DELETE,
      })({ urlParams: { correspondenceId, documentId } });

      this.dependsOn.splice(entity.index, 1);

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadDependsOn = async (correspondenceId: string) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/correspondences/{correspondenceId}/dependsOn",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfDocumentEntitiesDecoder,
      })({ urlParams: { correspondenceId } });

      const intlDate = this.intlDateStorage.getIntlDate();
      array.forEach((corr) => corr.configure(intlDate, this.profileStorage.user));
      this.dependsOn = array;

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadDependsTo = async (correspondenceId: string) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/documents/dependentOn/{correspondenceId}",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfDocumentEntitiesDecoder,
      })({ urlParams: { correspondenceId } });

      const intlDate = this.intlDateStorage.getIntlDate();
      array.forEach((corr) => corr.configure(intlDate, this.profileStorage.user));
      this.dependsTo = array;

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action removeBackDependency = async (correspondenceId: string, documentId: string) => {
    const entity = entityGetter(this.dependsTo, documentId, "id");
    if (!entity) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/documents/{documentId}/dependsOn/{correspondenceId}",
        method: METHODS.DELETE,
      })({ urlParams: { correspondenceId, documentId } });

      this.dependsTo.splice(entity.index, 1);

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
