import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { DocumentRootGroupEntity } from "entities/Document/Group/rootGroup";

import { getCurrentUser } from "modules/auth";
import { GetProjectService } from "modules/projects";

export interface CreateDocumentRootGroupInterface {
  name: string;
}

export type CreateDocumentRootGroupInProjectIdentifier = { projectId: string };

export type CreateDocumentRootGroupIdentifier = CreateDocumentRootGroupInProjectIdentifier;

@Injectable()
export class CreateDocumentRootGroupService {
  constructor(
    @InjectRepository(DocumentRootGroupEntity)
    private documentRootGroupRepository: Repository<DocumentRootGroupEntity>,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
  ) {}

  private async getIdentifierForCreateGroup(
    identifier: CreateDocumentRootGroupIdentifier,
  ): Promise<DeepPartial<DocumentRootGroupEntity>> {
    if ("projectId" in identifier) {
      const project = await this.getProjectService.getProjectOrFail(identifier.projectId);
      return { parentProject: { id: project.id } };
    }

    throw new Error("unknown state");
  }

  @Transactional()
  async createGroupOrFail(identifier: CreateDocumentRootGroupIdentifier, data: CreateDocumentRootGroupInterface) {
    const resultIdentifier = await this.getIdentifierForCreateGroup(identifier);

    const rootGroup = await this.documentRootGroupRepository.save({
      client: { id: getCurrentUser().clientId },
      ...resultIdentifier,
      name: data.name,
    });

    return rootGroup.id;
  }
}
