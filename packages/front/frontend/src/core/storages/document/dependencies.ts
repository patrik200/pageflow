import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { entityGetter, METHODS } from "@app/kit";
import { action, observable } from "mobx";
import { Inject, Service } from "typedi";

import {
  arrayOfCorrespondenceEntitiesDecoder,
  CorrespondenceEntity,
} from "core/entities/correspondence/correspondence";

import { IntlDateStorage } from "core/storages/intl-date";
import { ProfileStorage } from "core/storages/profile/profile";

@Service()
export class DocumentDependenciesStorage extends Storage {
  static token = "DocumentDependenciesStorage";

  constructor() {
    super();
    this.initStorage(DocumentDependenciesStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;
  @Inject() private profileStorage!: ProfileStorage;

  @observable dependsOn: CorrespondenceEntity[] = [];
  @observable dependsTo: CorrespondenceEntity[] = [];

  getIsDependent(correspondenceId: string) {
    return this.dependsOn.some((correspondence) => correspondence.id === correspondenceId);
  }

  @action createDependency = async (documentId: string, correspondence: CorrespondenceEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/documents/{documentId}/dependsOn/{correspondenceId}",
        method: METHODS.POST,
      })({ urlParams: { documentId, correspondenceId: correspondence.id } });

      this.dependsOn.push(correspondence);

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action removeDependency = async (documentId: string, correpondanceId: string) => {
    const entity = entityGetter(this.dependsOn, correpondanceId, "id");
    if (!entity) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/documents/{documentId}/dependsOn/{correpondanceId}",
        method: METHODS.DELETE,
      })({ urlParams: { documentId, correpondanceId } });

      this.dependsOn.splice(entity.index, 1);

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadDependsOn = async (documentId: string) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/documents/{documentId}/dependsOn",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfCorrespondenceEntitiesDecoder,
      })({ urlParams: { documentId } });

      const intlDate = this.intlDateStorage.getIntlDate();
      array.forEach((corr) => corr.configure(intlDate, this.profileStorage.user));
      this.dependsOn = array;

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadDependsTo = async (documentId: string) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/correspondences/dependentOn/{documentId}",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfCorrespondenceEntitiesDecoder,
      })({ urlParams: { documentId } });

      const intlDate = this.intlDateStorage.getIntlDate();
      array.forEach((corr) => corr.configure(intlDate, this.profileStorage.user));
      this.dependsTo = array;

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action removeBackDependency = async (documentId: string, correspondenceId: string) => {
    const entity = entityGetter(this.dependsTo, correspondenceId, "id");
    if (!entity) return { success: false, error: false } as const;

    try {
      await this.requestManager.createRequest({
        url: "/correspondences/{correspondenceId}/dependsOn/{documentId}",
        method: METHODS.DELETE,
      })({ urlParams: { documentId, correspondenceId } });

      this.dependsTo.splice(entity.index, 1);

      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
