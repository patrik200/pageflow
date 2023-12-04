import { action, observable } from "mobx";
import { Inject, Service } from "typedi";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { METHODS } from "@app/kit";

import { DocumentEntity } from "core/entities/document/document";
import { DocumentGroupsAndDocumentsEntity } from "core/entities/document/documentGroupsAndDocuments";

import { IntlDateStorage } from "core/storages/intl-date";
import { ProfileStorage } from "core/storages/profile/profile";

import { DocumentFilterEntity } from "./entities/document/DocumentFilter";

@Service()
export class DocumentSelectModalStorage extends Storage {
  static token = "DocumentSelectModalStorage";

  constructor() {
    super();
    this.initStorage(DocumentSelectModalStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;
  @Inject() private profileStorage!: ProfileStorage;

  @observable filter!: DocumentFilterEntity;
  @observable documents: DocumentEntity[] = [];

  @action initProjectFilter(projectId: string | null) {
    this.filter = DocumentFilterEntity.buildForProject(projectId);
  }

  @action getGroupsAndDocuments = async (filter: DocumentFilterEntity, acrossAllProjects: boolean) => {
    try {
      const results = await this.requestManager.createRequest({
        url: "/documents",
        method: METHODS.GET,
        serverDataEntityDecoder: DocumentGroupsAndDocumentsEntity,
      })({ body: { ...filter.apiReady, acrossAllProjects } });
      results.configure(this.intlDateStorage.getIntlDate(), this.profileStorage.user);
      return { success: true, data: results.documents } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadDocuments = async (acrossAllProjects: boolean) => {
    const result = await this.getGroupsAndDocuments(this.filter, acrossAllProjects);
    if (result.success) this.documents = result.data;
    return result;
  };
}
