import { entityGetter, METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action, observable } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { CorrespondenceRevisionStatus } from "@app/shared-enums";

import {
  arrayOfCorrespondenceRevisionEntitiesDecoder,
  CorrespondenceRevisionEntity,
} from "core/entities/correspondenceRevision/revision";
import { IdEntity } from "core/entities/id";
import { CorrespondenceRevisionDetailEntity } from "core/entities/correspondenceRevision/revisionDetail";
import { FileEntity } from "core/entities/file";
import { arrayOfChangeFeedEventEntities } from "core/entities/change-feed";

import { IntlDateStorage } from "core/storages/intl-date";
import { updateFileArrayRequest, updateFileRequest } from "core/storages/_common/updateFile";

import { EditCorrespondenceRevisionEntity } from "./entities/revision/EditCorrespondenceRevision";
import { CorrespondenceRevisionFilterEntity } from "./entities/revision/CorrespondenceRevisionFilter";

@Service()
export class CorrespondenceRevisionsStorage extends Storage {
  static token = "CorrespondenceRevisionsStorage";

  constructor() {
    super();
    this.initStorage(CorrespondenceRevisionsStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;
  @Inject() private intlDateStorage!: IntlDateStorage;

  @observable revisions: CorrespondenceRevisionEntity[] = [];
  @observable revisionDetail: CorrespondenceRevisionDetailEntity | null = null;

  @action loadRevisions = async (filter: CorrespondenceRevisionFilterEntity) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/correspondence-revisions/correspondence/{correspondenceId}/revisions",
        method: METHODS.GET,
        responseDataFieldPath: ["list"],
        serverDataEntityDecoder: arrayOfCorrespondenceRevisionEntitiesDecoder,
      })({ urlParams: filter.apiReady.url, body: filter.apiReady.body });
      const intlDate = this.intlDateStorage.getIntlDate();
      array.forEach((revision) => revision.configure(intlDate));
      this.revisions = array;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action loadRevisionDetail = async (revisionId: string) => {
    try {
      const [revision, { array: changeFeedEvents }] = await Promise.all([
        this.requestManager.createRequest({
          url: "/correspondence-revisions/{revisionId}",
          method: METHODS.GET,
          serverDataEntityDecoder: CorrespondenceRevisionDetailEntity,
        })({ urlParams: { revisionId } }),
        this.requestManager.createRequest({
          url: "/change-feed/correspondence_revision/{revisionId}",
          method: METHODS.GET,
          serverDataEntityDecoder: arrayOfChangeFeedEventEntities,
          responseDataFieldPath: ["list"],
        })({ urlParams: { revisionId } }),
      ]);
      revision.changeFeedEvents = changeFeedEvents;
      revision.configure(this.intlDateStorage.getIntlDate());
      this.revisionDetail = revision;
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createRevision = async (entity: EditCorrespondenceRevisionEntity) => {
    try {
      const { id: revisionId } = await this.requestManager.createRequest({
        url: "/correspondence-revisions/correspondence/{correspondenceId}/revisions",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({ urlParams: { correspondenceId: entity.apiCreateReady.correspondenceId }, body: entity.apiCreateReady.body });

      const uploadResults = await Promise.all(
        entity.attachments.map((attachment) =>
          updateFileRequest(null, attachment, {
            uploadFile: (body) =>
              this.requestManager.createRequest({
                url: "/correspondence-revisions/{revisionId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({ urlParams: { revisionId }, body, progressReceiver: attachment.setProgress }),
            deleteFile: () => null!,
          }),
        ),
      );

      return { success: true, revisionId, uploadResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action updateRevision = async (entity: EditCorrespondenceRevisionEntity) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondence-revisions/{revisionId}",
        method: METHODS.PATCH,
      })({ urlParams: { revisionId: entity.apiUpdateReady.revisionId }, body: entity.apiUpdateReady.body });

      const { uploadResults, deleteResults } = await updateFileArrayRequest(
        this.revisionDetail!.files,
        entity.attachments,
        {
          uploadFile: (body, attachment) =>
            this.requestManager
              .createRequest({
                url: "/correspondence-revisions/{revisionId}/upload",
                method: METHODS.POST,
                serverDataEntityDecoder: FileEntity,
              })({
                urlParams: { revisionId: entity.apiUpdateReady.revisionId },
                body,
                progressReceiver: attachment.setProgress,
              })
              .finally(() => attachment.setProgress(undefined)),
          deleteFile: (fileId) =>
            this.requestManager.createRequest({
              url: "/correspondence-revisions/{revisionId}/delete-file/{fileId}",
              method: METHODS.DELETE,
            })({
              urlParams: { revisionId: entity.apiUpdateReady.revisionId, fileId },
            }),
        },
      );

      return { success: true, uploadResults, deleteResults } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action setFavourite = async (revisionId: string, favourite: boolean) => {
    const revisionInList = entityGetter(this.revisions, revisionId, "id");

    try {
      await this.requestManager.createRequest({
        url: "/correspondence-revisions/favourites/{revisionId}",
        method: favourite ? METHODS.POST : METHODS.DELETE,
      })({ urlParams: { revisionId } });
      if (revisionInList) revisionInList.entity.setFavourite(favourite);
      if (this.revisionDetail?.id === revisionId) this.revisionDetail.setFavourite(favourite);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action archive = async () => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondence-revisions/{revisionId}/archive",
        method: METHODS.POST,
      })({ urlParams: { revisionId: this.revisionDetail!.id } });
      this.revisionDetail!.setCanArchiveByStatus(false);
      this.revisionDetail!.setCanActiveByStatus(true);
      this.revisionDetail!.setStatus(CorrespondenceRevisionStatus.ARCHIVE);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action active = async () => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondence-revisions/{revisionId}/active",
        method: METHODS.POST,
      })({ urlParams: { revisionId: this.revisionDetail!.id } });
      this.revisionDetail!.setCanActiveByStatus(false);
      this.revisionDetail!.setCanArchiveByStatus(true);
      this.revisionDetail!.setStatus(CorrespondenceRevisionStatus.ACTIVE);
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action delete = async (revisionId: string) => {
    try {
      await this.requestManager.createRequest({
        url: "/correspondence-revisions/{revisionId}",
        method: METHODS.DELETE,
      })({ urlParams: { revisionId } });
      return { success: true } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
