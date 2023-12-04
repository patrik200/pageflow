import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { METHODS } from "@app/kit";
import { action, observable } from "mobx";
import { Inject, Service } from "typedi";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";
import { CorrespondenceGroupsAndCorrespondencesEntity } from "core/entities/correspondence/correspondenceGroupsAndCorrespondences";

import { IntlDateStorage } from "core/storages/intl-date";
import { ProfileStorage } from "core/storages/profile/profile";

import { CorrespondenceFilterEntity } from "./entities/correspondence/CorrespondenceFilter";

@Service()
export class CorrespondenceSelectModalStorage extends Storage {
  static token = "CorrespondenceSelectModalStorage";

  constructor() {
    super();
    this.initStorage(CorrespondenceSelectModalStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;
  @Inject() private profileStorage!: ProfileStorage;

  @observable filter!: CorrespondenceFilterEntity;

  @observable correspondences: CorrespondenceEntity[] = [];

  @action initProjectFilter(projectId: string) {
    this.filter = CorrespondenceFilterEntity.buildForProject(projectId);
  }

  @action private getGroupsAndCorrespondences = async (filter: CorrespondenceFilterEntity) => {
    try {
      const results = await this.requestManager.createRequest({
        url: "/correspondences",
        method: METHODS.GET,
        serverDataEntityDecoder: CorrespondenceGroupsAndCorrespondencesEntity,
      })({ body: filter.apiReady });
      results.configure(this.intlDateStorage.getIntlDate(), this.profileStorage.user);
      return { success: true, data: results.correspondences } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadCorrespondences = async () => {
    const result = await this.getGroupsAndCorrespondences(this.filter);
    if (result.success) this.correspondences = result.data;
    return result;
  };
}
