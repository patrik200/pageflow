import { ElasticDocumentData, ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";

import { GetCorrespondenceRevisionService } from "./get";

@Injectable()
export class MoveCorrespondenceRevisionService {
  constructor(
    private elasticService: ElasticService,
    private getCorrespondenceRevisionService: GetCorrespondenceRevisionService,
  ) {}

  private getElasticRevisionId(revisionId: string) {
    return this.elasticService.getDocumentId("correspondence-revisions", revisionId);
  }

  async syncParentGroupIdsPath(revisionId: string) {
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId, {
      loadCorrespondenceParentGroup: true,
    });

    await this.elasticService.updateDocumentOrFail(
      this.getElasticRevisionId(revision.id),
      this.elasticService.updateNullOrUndefined<string>(
        this.elasticService.getHierarchyPath(revision.correspondence.parentGroup?.path),
        "correspondenceParentGroupIdsPath",
      ) as ElasticDocumentData,
    );
  }

  async syncRootGroupId(revisionId: string) {
    const revision = await this.getCorrespondenceRevisionService.getRevisionOrFail(revisionId, {
      loadCorrespondenceRootGroup: true,
    });

    await this.elasticService.updateDocumentOrFail(
      this.getElasticRevisionId(revision.id),
      this.elasticService.updateNullOrUndefined<string>(
        revision.correspondence.rootGroup!.id,
        "correspondenceRootGroupId",
      ) as ElasticDocumentData,
    );
  }
}
