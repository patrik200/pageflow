import { Injectable, Logger } from "@nestjs/common";
import { ElasticDocumentData, ElasticService, StorageGetService } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { CreateDocumentRevisionFilesElasticService } from "../files/create-elastic";

@Injectable()
export class CreateDocumentRevisionsElasticService {
  constructor(
    @InjectRepository(DocumentRevisionEntity) private revisionsRepository: Repository<DocumentRevisionEntity>,
    private elasticService: ElasticService,
    private storageGetService: StorageGetService,
    private createDocumentRevisionFilesElasticService: CreateDocumentRevisionFilesElasticService,
  ) {}

  async elasticCreateRevisionIndexOrFail(documentRevisionId: string, refreshIndexes?: boolean) {
    const revision = await this.revisionsRepository.findOneOrFail({
      where: { id: documentRevisionId },
      relations: { document: { parentGroup: true, rootGroup: true, client: true }, files: { file: true } },
    });

    await this.elasticService.addDocumentOrFail(
      this.elasticService.getDocumentId("document-revisions", revision.id),
      {
        clientId: revision.document.client.id,
        documentParentGroupIdsPath: this.elasticService.getHierarchyPath(revision.document.parentGroup?.path),
        documentRootGroupId: revision.document.rootGroup.id,
        documentId: revision.document.id,
        number: revision.number,
        status: revision.status,
      } as ElasticDocumentData,
      refreshIndexes,
    );

    for (const { file, hasElasticAttachment } of revision.files) {
      if (!hasElasticAttachment) continue;
      const buffer = await this.storageGetService.getFileBuffer({ id: file.id, bucket: file.bucket });
      if (!buffer) {
        Logger.warn(
          `Error while creating elastic document attachment to \
document revision "${revision.id}": file stream "${file.id}" is null. Skip...`,
          "Elastic document revision attachments",
        );
        continue;
      }

      await this.createDocumentRevisionFilesElasticService.elasticAddRevisionAttachment(
        revision.id,
        { entity: file, buffer },
        { refreshIndex: refreshIndexes },
      );
    }
  }
}
