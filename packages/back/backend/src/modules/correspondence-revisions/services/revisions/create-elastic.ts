import { ElasticDocumentData, ElasticService, StorageGetService } from "@app/back-kit";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { CreateCorrespondenceRevisionFilesElasticService } from "../files/create-elastic";

@Injectable()
export class CreateCorrespondenceRevisionsElasticService {
  constructor(
    @InjectRepository(CorrespondenceRevisionEntity)
    private revisionRepository: Repository<CorrespondenceRevisionEntity>,
    private createRevisionFilesElasticService: CreateCorrespondenceRevisionFilesElasticService,
    private elasticService: ElasticService,
    private storageGetService: StorageGetService,
  ) {}

  async elasticCreateCorrespondenceRevisionIndexOrFail(correspondenceRevisionId: string, refreshIndexes?: boolean) {
    const revision = await this.revisionRepository.findOneOrFail({
      where: { id: correspondenceRevisionId },
      relations: {
        correspondence: { client: true, parentGroup: true, rootGroup: true },
        files: { file: true },
      },
    });

    await this.elasticService.addDocumentOrFail(
      this.elasticService.getDocumentId("correspondence-revisions", revision.id),
      {
        clientId: revision.correspondence.client.id,
        correspondenceParentGroupIdsPath: this.elasticService.getHierarchyPath(
          revision.correspondence.parentGroup?.path,
        ),
        correspondenceRootGroupId: revision.correspondence.rootGroup.id,
        correspondenceId: revision.correspondence.id,
        status: revision.status,
        number: revision.number,
      } as ElasticDocumentData,
      refreshIndexes,
    );

    for (const { file, hasElasticAttachment } of revision.files) {
      if (!hasElasticAttachment) continue;

      const buffer = await this.storageGetService.getFileBuffer({ id: file.id, bucket: file.bucket });
      if (!buffer) {
        Logger.warn(
          `Error while creating elastic correspondence attachment to \
correspondence revision "${revision.id}": file stream "${file.id}" is null. Skip...`,
          "Elastic correspondence revision attachments",
        );
        continue;
      }

      await this.createRevisionFilesElasticService.elasticAddRevisionAttachment(
        revision.id,
        { entity: file, buffer },
        { refreshIndex: refreshIndexes },
      );
    }
  }
}
