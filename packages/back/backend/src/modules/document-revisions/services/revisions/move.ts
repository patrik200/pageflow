import { Injectable } from "@nestjs/common";
import { ElasticDocumentData, ElasticService } from "@app/back-kit";

import { GetDocumentRevisionService } from "./get";

@Injectable()
export class MoveDocumentRevisionsService {
  constructor(private elasticService: ElasticService, private getDocumentRevisionService: GetDocumentRevisionService) {}

  async syncParentGroupIdsPath(revisionId: string) {
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId, {
      loadDocumentParentGroup: true,
    });

    await this.elasticService.updateDocumentOrFail(
      this.elasticService.getDocumentId("document-revisions", revisionId),
      this.elasticService.updateNullOrUndefined<string>(
        this.elasticService.getHierarchyPath(revision.document.parentGroup?.path),
        "documentParentGroupIdsPath",
      ) as ElasticDocumentData,
    );
  }

  async syncRootGroupId(revisionId: string) {
    const revision = await this.getDocumentRevisionService.getRevisionOrFail(revisionId, {
      loadDocumentRootGroup: true,
    });

    await this.elasticService.updateDocumentOrFail(
      this.elasticService.getDocumentId("document-revisions", revisionId),
      this.elasticService.updateNullOrUndefined<string>(
        revision.document.rootGroup!.id,
        "documentRootGroupId",
      ) as ElasticDocumentData,
    );
  }
}
