import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsRelations, IsNull, Repository } from "typeorm";

import { CorrespondenceRootGroupEntity } from "entities/Correspondence/Group/rootGroup";

import { getCurrentUser } from "modules/auth";
import { GetProjectService } from "modules/projects";
import { GetDocumentService } from "modules/documents";

export type GetCorrespondenceRootGroupInClientIdentifier = {};
export type GetCorrespondenceRootGroupInProjectIdentifier = { projectId: string };
export type GetCorrespondenceRootGroupInDocumentIdentifier = { documentId: string };

export type GetCorrespondenceRootGroupIdentifier =
  | GetCorrespondenceRootGroupInClientIdentifier
  | GetCorrespondenceRootGroupInProjectIdentifier
  | GetCorrespondenceRootGroupInDocumentIdentifier
  | { rootGroupId: string };

export interface CorrespondenceRootGroupSelectOptions {
  loadParentDocument?: boolean;
  loadParentProject?: boolean;
  loadAllChildrenGroups?: boolean;
  loadAllChildrenGroupsParentGroup?: boolean;
  loadAllChildrenCorrespondences?: boolean;
  loadAllChildrenCorrespondencesParentGroup?: boolean;
}

@Injectable()
export class GetCorrespondenceRootGroupService {
  constructor(
    @InjectRepository(CorrespondenceRootGroupEntity)
    private correspondenceRootGroupRepository: Repository<CorrespondenceRootGroupEntity>,
    @Inject(forwardRef(() => GetProjectService)) private getProjectService: GetProjectService,
    @Inject(forwardRef(() => GetDocumentService)) private getDocumentService: GetDocumentService,
  ) {}

  async dangerGetCorrespondenceRootGroupOrFail(
    clientId: string,
    identifierOptions: GetCorrespondenceRootGroupIdentifier,
    options: CorrespondenceRootGroupSelectOptions = {},
  ) {
    const commonRelations: FindOptionsRelations<CorrespondenceRootGroupEntity> = {
      client: true,
      parentDocument: options.loadParentDocument,
      parentProject: options.loadParentProject,
      allChildrenGroups: options.loadAllChildrenGroups
        ? {
            parentGroup: options.loadAllChildrenGroupsParentGroup,
          }
        : false,
      allChildrenCorrespondences: options.loadAllChildrenCorrespondences
        ? {
            parentGroup: options.loadAllChildrenCorrespondencesParentGroup,
          }
        : false,
    };

    if ("rootGroupId" in identifierOptions) {
      return await this.correspondenceRootGroupRepository.findOneOrFail({
        where: { client: { id: clientId }, id: identifierOptions.rootGroupId },
        relations: commonRelations,
      });
    }

    if ("projectId" in identifierOptions) {
      return await this.correspondenceRootGroupRepository.findOneOrFail({
        where: { client: { id: clientId }, parentProject: { id: identifierOptions.projectId } },
        relations: {
          ...commonRelations,
          parentProject: true,
        },
      });
    }

    if ("documentId" in identifierOptions) {
      return await this.correspondenceRootGroupRepository.findOneOrFail({
        where: { client: { id: clientId }, parentDocument: { id: identifierOptions.documentId } },
        relations: {
          ...commonRelations,
          parentDocument: true,
        },
      });
    }

    return await this.correspondenceRootGroupRepository.findOneOrFail({
      where: { client: { id: clientId }, parentProject: IsNull(), parentDocument: IsNull() },
      relations: commonRelations,
    });
  }

  async unsafeGetCorrespondenceRootGroupOrFail(
    identifierOptions: GetCorrespondenceRootGroupIdentifier,
    options: CorrespondenceRootGroupSelectOptions = {},
  ) {
    const currentUser = getCurrentUser();
    return await this.dangerGetCorrespondenceRootGroupOrFail(currentUser.clientId, identifierOptions, options);
  }

  async getCorrespondenceRootGroupOrFail(
    identifierOptions: GetCorrespondenceRootGroupIdentifier,
    options?: CorrespondenceRootGroupSelectOptions,
  ) {
    if ("rootGroupId" in identifierOptions) {
      return await this.unsafeGetCorrespondenceRootGroupOrFail({ rootGroupId: identifierOptions.rootGroupId }, options);
    }

    if ("projectId" in identifierOptions) {
      await this.getProjectService.getProjectOrFail(identifierOptions.projectId);
      return await this.unsafeGetCorrespondenceRootGroupOrFail({ projectId: identifierOptions.projectId }, options);
    }

    if ("documentId" in identifierOptions) {
      await this.getDocumentService.getDocumentOrFail(identifierOptions.documentId);
      return await this.unsafeGetCorrespondenceRootGroupOrFail({ documentId: identifierOptions.documentId }, options);
    }

    return await this.unsafeGetCorrespondenceRootGroupOrFail({}, options);
  }
}
