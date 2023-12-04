import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentRootGroupEntity } from "entities/Document/Group/rootGroup";

import { DeleteDocumentGroupService } from "./delete";
import { DeleteDocumentService } from "../documents/delete";

@Injectable()
export class DeleteDocumentRootGroupService {
  constructor(
    @InjectRepository(DocumentRootGroupEntity)
    private documentRootGroupRepository: Repository<DocumentRootGroupEntity>,
    private deleteDocumentGroupService: DeleteDocumentGroupService,
    private deleteDocumentService: DeleteDocumentService,
  ) {}

  @Transactional()
  async deleteGroupOrFail(rootGroupId: string) {
    const rootGroup = await this.documentRootGroupRepository.findOneOrFail({
      where: { id: rootGroupId },
      relations: {
        allChildrenGroups: { parentGroup: true },
        allChildrenDocuments: { parentGroup: true },
      },
    });

    await Promise.all([
      ...rootGroup.allChildrenGroups.map(({ id, parentGroup }) => {
        if (parentGroup) return null;
        return this.deleteDocumentGroupService.deleteGroupOrFail(id, { checkPermissions: false });
      }),
      ...rootGroup.allChildrenDocuments.map(({ id, parentGroup }) => {
        if (parentGroup) return null;
        return this.deleteDocumentService.deleteDocumentOrFail(id, { checkPermissions: false });
      }),
    ]);

    await this.documentRootGroupRepository.delete({ id: rootGroup.id });
  }
}
