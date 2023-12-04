import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { typeormAlias } from "@app/back-kit";

import { DocumentRootGroupEntity } from "entities/Document/Group/rootGroup";

import { getCurrentUser } from "modules/auth";
import { GetProjectService } from "modules/projects";

export type GetDocumentRootGroupInProjectIdentifierOptions = { projectId: string };

export type GetDocumentRootGroupIdentifierOptions =
  | GetDocumentRootGroupInProjectIdentifierOptions
  | { rootGroupId: string };

@Injectable()
export class GetDocumentRootGroupService {
  constructor(
    @InjectRepository(DocumentRootGroupEntity) private documentRootGroupRepository: Repository<DocumentRootGroupEntity>,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
  ) {}

  async unsafeGetDocumentRootGroupOrFail(identifierOptions: GetDocumentRootGroupIdentifierOptions) {
    const currentUser = getCurrentUser();

    if ("rootGroupId" in identifierOptions) {
      return await this.documentRootGroupRepository.findOneOrFail({
        where: { client: { id: currentUser.clientId }, id: identifierOptions.rootGroupId },
      });
    }

    if ("projectId" in identifierOptions) {
      return await this.documentRootGroupRepository.findOneOrFail({
        where: { client: { id: currentUser.clientId }, parentProject: { id: identifierOptions.projectId } },
        join: { alias: typeormAlias, innerJoin: { parentProject: typeormAlias + ".parentProject" } },
      });
    }

    throw new Error("unknown state");
  }

  async getDocumentRootGroupOrFail(identifierOptions: GetDocumentRootGroupIdentifierOptions) {
    if ("rootGroupId" in identifierOptions) {
      return await this.unsafeGetDocumentRootGroupOrFail({ rootGroupId: identifierOptions.rootGroupId });
    }

    if ("projectId" in identifierOptions) {
      await this.getProjectService.getProjectOrFail(identifierOptions.projectId);
      return await this.unsafeGetDocumentRootGroupOrFail({ projectId: identifierOptions.projectId });
    }

    throw new Error("unknown state");
  }
}
