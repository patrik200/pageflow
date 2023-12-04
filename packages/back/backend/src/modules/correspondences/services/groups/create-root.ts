import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { CorrespondenceRootGroupEntity } from "entities/Correspondence/Group/rootGroup";

import { getCurrentUser } from "modules/auth";
import { GetProjectService } from "modules/projects";
import { GetDocumentService } from "modules/documents";

export interface CreateCorrespondenceRootGroupInterface {
  name: string;
}

export type CreateCorrespondenceRootGroupInClientIdentifier = {};

export type CreateCorrespondenceRootGroupInProjectIdentifier = { projectId: string };

export type CreateCorrespondenceRootGroupInDocumentIdentifier = { documentId: string };

export type CreateCorrespondenceRootGroupIdentifier =
  | CreateCorrespondenceRootGroupInClientIdentifier
  | CreateCorrespondenceRootGroupInProjectIdentifier
  | CreateCorrespondenceRootGroupInDocumentIdentifier;

@Injectable()
export class CreateCorrespondenceRootGroupService {
  constructor(
    @InjectRepository(CorrespondenceRootGroupEntity)
    private correspondenceRootGroupRepository: Repository<CorrespondenceRootGroupEntity>,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
  ) {}

  private async getIdentifierForCreateGroup(
    identifier: CreateCorrespondenceRootGroupIdentifier,
  ): Promise<DeepPartial<CorrespondenceRootGroupEntity>> {
    if ("projectId" in identifier) {
      const project = await this.getProjectService.getProjectOrFail(identifier.projectId);
      return { parentProject: { id: project.id } };
    }

    if ("documentId" in identifier) {
      const document = await this.getDocumentService.getDocumentOrFail(identifier.documentId);
      return { parentDocument: { id: document.id } };
    }

    return {};
  }

  @Transactional()
  async createGroupOrFail(
    identifier: CreateCorrespondenceRootGroupIdentifier,
    data: CreateCorrespondenceRootGroupInterface,
  ) {
    const resultIdentifier = await this.getIdentifierForCreateGroup(identifier);

    const rootGroup = await this.correspondenceRootGroupRepository.save({
      client: { id: getCurrentUser().clientId },
      ...resultIdentifier,
      name: data.name,
    });

    return rootGroup.id;
  }
}
