import { METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, Storage } from "@app/front-kit";

import { arrayOfDocumentEntitiesDecoder, DocumentEntity } from "core/entities/document/document";
import { arrayOfDocumentGroupEntitiesDecoder, DocumentGroupEntity } from "core/entities/document/group";
import {
  arrayOfCorrespondenceEntitiesDecoder,
  CorrespondenceEntity,
} from "core/entities/correspondence/correspondence";
import {
  arrayOfCorrespondenceGroupEntitiesDecoder,
  CorrespondenceGroupEntity,
} from "core/entities/correspondence/group";
import {
  arrayOfDocumentRevisionEntitiesDecoder,
  DocumentRevisionEntity,
} from "core/entities/documentRevision/revision";
import {
  arrayOfCorrespondenceRevisionEntitiesDecoder,
  CorrespondenceRevisionEntity,
} from "core/entities/correspondenceRevision/revision";
import { arrayOfProjectEntitiesDecoder, ProjectEntity } from "core/entities/project/project";

import { IntlDateStorage } from "core/storages/intl-date";
import { ProfileStorage } from "core/storages/profile/profile";

@Service()
export class HomeStorage extends Storage {
  static token = "HomeStorage";

  constructor() {
    super();
    this.initStorage(HomeStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;
  @Inject() private profileStorage!: ProfileStorage;

  @observable documents: DocumentEntity[] = [];
  @observable documentGroups: DocumentGroupEntity[] = [];
  @observable documentRevisions: DocumentRevisionEntity[] = [];
  @observable correspondences: CorrespondenceEntity[] = [];
  @observable correspondenceGroups: CorrespondenceGroupEntity[] = [];
  @observable correspondenceRevisions: CorrespondenceRevisionEntity[] = [];
  @observable projects: ProjectEntity[] = [];

  @action private loadDocuments = async () => {
    const { array } = await this.requestManager.createRequest({
      url: "/documents/favourites/document",
      method: METHODS.GET,
      responseDataFieldPath: ["list"],
      serverDataEntityDecoder: arrayOfDocumentEntitiesDecoder,
    })();
    const intlDate = this.intlDateStorage.getIntlDate();
    array.forEach((document) => document.configure(intlDate, this.profileStorage.user));
    this.documents = array;
  };

  @action private loadDocumentGroups = async () => {
    const { array } = await this.requestManager.createRequest({
      url: "/documents/favourites/document-group",
      method: METHODS.GET,
      responseDataFieldPath: ["list"],
      serverDataEntityDecoder: arrayOfDocumentGroupEntitiesDecoder,
    })();
    const intlDate = this.intlDateStorage.getIntlDate();
    array.forEach((document) => document.configure(intlDate, this.profileStorage.user));
    this.documentGroups = array;
  };

  @action private loadCorrespondences = async () => {
    const { array } = await this.requestManager.createRequest({
      url: "/correspondences/favourites/correspondence",
      method: METHODS.GET,
      responseDataFieldPath: ["list"],
      serverDataEntityDecoder: arrayOfCorrespondenceEntitiesDecoder,
    })();
    const intlDate = this.intlDateStorage.getIntlDate();
    array.forEach((correspondence) => correspondence.configure(intlDate, this.profileStorage.user));
    this.correspondences = array;
  };

  @action private loadCorrespondenceGroups = async () => {
    const { array } = await this.requestManager.createRequest({
      url: "/correspondences/favourites/correspondence-group",
      method: METHODS.GET,
      responseDataFieldPath: ["list"],
      serverDataEntityDecoder: arrayOfCorrespondenceGroupEntitiesDecoder,
    })();
    const intlDate = this.intlDateStorage.getIntlDate();
    array.forEach((correspondence) => correspondence.configure(intlDate, this.profileStorage.user));
    this.correspondenceGroups = array;
  };

  @action private loadDocumentRevisions = async () => {
    const { array } = await this.requestManager.createRequest({
      url: "/document-revisions/favourites",
      method: METHODS.GET,
      responseDataFieldPath: ["list"],
      serverDataEntityDecoder: arrayOfDocumentRevisionEntitiesDecoder,
    })();
    const intlDate = this.intlDateStorage.getIntlDate();
    array.forEach((correspondence) => correspondence.configure(intlDate));
    this.documentRevisions = array;
  };

  @action private loadCorrespondenceRevisions = async () => {
    const { array } = await this.requestManager.createRequest({
      url: "/correspondence-revisions/favourites",
      method: METHODS.GET,
      responseDataFieldPath: ["list"],
      serverDataEntityDecoder: arrayOfCorrespondenceRevisionEntitiesDecoder,
    })();
    const intlDate = this.intlDateStorage.getIntlDate();
    array.forEach((correspondence) => correspondence.configure(intlDate));
    this.correspondenceRevisions = array;
  };

  @action private loadProjects = async () => {
    const { array } = await this.requestManager.createRequest({
      url: "/projects/favourites",
      method: METHODS.GET,
      responseDataFieldPath: ["list"],
      serverDataEntityDecoder: arrayOfProjectEntitiesDecoder,
    })();
    const intlDate = this.intlDateStorage.getIntlDate();
    array.forEach((correspondence) => correspondence.configure(intlDate, this.profileStorage.user));
    this.projects = array;
  };

  @action loadAll = async () => {
    await Promise.all([
      this.loadDocuments(),
      this.loadDocumentGroups(),
      this.loadCorrespondences(),
      this.loadCorrespondenceGroups(),
      this.loadDocumentRevisions(),
      this.loadCorrespondenceRevisions(),
      this.loadProjects(),
    ]);
  };
}
