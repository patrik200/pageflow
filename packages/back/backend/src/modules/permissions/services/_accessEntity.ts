import { PermissionEntityType, UserRole } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { PermissionEntity } from "entities/Permission";
import { TicketBoardEntity } from "entities/TicketBoard";
import { ProjectEntity } from "entities/Project";
import { CorrespondenceGroupEntity } from "entities/Correspondence/Group/group";
import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";
import { DocumentGroupEntity } from "entities/Document/Group/group";
import { DocumentEntity } from "entities/Document/Document";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class PermissionAccessEntityService {
  constructor(
    @InjectRepository(PermissionEntity) private permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(TicketBoardEntity) private ticketBoardRepository: Repository<TicketBoardEntity>,
    @InjectRepository(ProjectEntity) private projectRepository: Repository<ProjectEntity>,
    @InjectRepository(CorrespondenceGroupEntity)
    private correspondenceGroupRepository: Repository<CorrespondenceGroupEntity>,
    @InjectRepository(CorrespondenceEntity) private correspondenceRepository: Repository<CorrespondenceEntity>,
    @InjectRepository(DocumentGroupEntity) private documentGroupRepository: Repository<DocumentGroupEntity>,
    @InjectRepository(DocumentEntity) private documentRepository: Repository<DocumentEntity>,
  ) {}

  private async hasPrivateAccessToEntity(entityId: string, entityType: PermissionEntityType) {
    const permissionEntity = await this.permissionRepository.findOne({
      where: { entityId, entityType, user: { id: getCurrentUser().userId } },
    });
    return !!permissionEntity;
  }

  private getUser(userToCheckId: string | undefined) {
    if (userToCheckId) return { userId: userToCheckId, clientId: undefined, role: UserRole.USER };
    return getCurrentUser();
  }

  private async hasReadAccessToTicketBoard(boardId: string, userToCheckId: string | undefined) {
    const user = this.getUser(userToCheckId);
    const whereOptions: FindOptionsWhere<TicketBoardEntity> = { id: boardId };
    if (user.clientId) whereOptions.client = { id: user.clientId };
    const board = await this.ticketBoardRepository.findOneOrFail({ where: whereOptions, relations: { project: true } });
    if (user.role === UserRole.ADMIN) return true;
    if (board.isPrivate) return await this.hasPrivateAccessToEntity(board.id, PermissionEntityType.TICKET_BOARD);
    if (board.project) return await this.hasReadAccessToProject(board.project.id, userToCheckId);
    return true;
  }

  private async hasReadAccessToCorrespondenceGroup(
    groupId: string,
    userToCheckId: string | undefined,
  ): Promise<boolean> {
    const user = this.getUser(userToCheckId);
    const whereOptions: FindOptionsWhere<CorrespondenceGroupEntity> = { id: groupId };
    if (user.clientId) whereOptions.client = { id: user.clientId };
    const group = await this.correspondenceGroupRepository.findOneOrFail({
      where: whereOptions,
      relations: { parentGroup: true },
    });
    if (user.role === UserRole.ADMIN) return true;
    if (group.isPrivate)
      return await this.hasPrivateAccessToEntity(group.id, PermissionEntityType.CORRESPONDENCE_GROUP);
    if (group.parentGroup) {
      return await this.hasReadAccessToCorrespondenceGroup(group.parentGroup.id, userToCheckId);
    }
    const groupWithRoot = await this.correspondenceGroupRepository.findOneOrFail({
      where: { id: groupId },
      relations: { rootGroup: { parentProject: true, parentDocument: true } },
    });

    if (groupWithRoot.rootGroup.parentProject)
      return await this.hasReadAccessToProject(groupWithRoot.rootGroup.parentProject.id, userToCheckId);

    if (groupWithRoot.rootGroup.parentDocument) {
      return await this.hasReadAccessToDocument(groupWithRoot.rootGroup.parentDocument.id, userToCheckId);
    }

    return true;
  }

  private async hasReadAccessToCorrespondence(
    correspondenceId: string,
    userToCheckId: string | undefined,
  ): Promise<boolean> {
    const user = this.getUser(userToCheckId);
    const whereOptions: FindOptionsWhere<CorrespondenceEntity> = { id: correspondenceId };
    if (user.clientId) whereOptions.client = { id: user.clientId };
    const correspondence = await this.correspondenceRepository.findOneOrFail({
      where: whereOptions,
      relations: { parentGroup: true },
    });
    if (user.role === UserRole.ADMIN) return true;
    if (correspondence.isPrivate)
      return await this.hasPrivateAccessToEntity(correspondence.id, PermissionEntityType.CORRESPONDENCE);
    if (correspondence.parentGroup) {
      return await this.hasReadAccessToCorrespondenceGroup(correspondence.parentGroup.id, userToCheckId);
    }
    const correspondenceWithRoot = await this.correspondenceRepository.findOneOrFail({
      where: { id: correspondenceId },
      relations: { rootGroup: { parentProject: true, parentDocument: true } },
    });

    if (correspondenceWithRoot.rootGroup.parentProject)
      return await this.hasReadAccessToProject(correspondenceWithRoot.rootGroup.parentProject.id, userToCheckId);

    if (correspondenceWithRoot.rootGroup.parentDocument) {
      return await this.hasReadAccessToDocument(correspondenceWithRoot.rootGroup.parentDocument.id, userToCheckId);
    }

    return true;
  }

  private async hasReadAccessToDocumentGroup(groupId: string, userToCheckId: string | undefined): Promise<boolean> {
    const user = this.getUser(userToCheckId);
    const whereOptions: FindOptionsWhere<DocumentGroupEntity> = { id: groupId };
    if (user.clientId) whereOptions.client = { id: user.clientId };
    const group = await this.documentGroupRepository.findOneOrFail({
      where: whereOptions,
      relations: { parentGroup: true },
    });
    if (user.role === UserRole.ADMIN) return true;
    if (group.isPrivate) return await this.hasPrivateAccessToEntity(group.id, PermissionEntityType.DOCUMENT_GROUP);
    if (group.parentGroup) {
      return await this.hasReadAccessToDocumentGroup(group.parentGroup.id, userToCheckId);
    }
    const groupWithRoot = await this.documentGroupRepository.findOneOrFail({
      where: { id: groupId },
      relations: { rootGroup: { parentProject: true } },
    });

    if (groupWithRoot.rootGroup.parentProject)
      return await this.hasReadAccessToProject(groupWithRoot.rootGroup.parentProject.id, userToCheckId);

    return true;
  }

  private async hasReadAccessToDocument(documentId: string, userToCheckId: string | undefined): Promise<boolean> {
    const user = this.getUser(userToCheckId);
    const whereOptions: FindOptionsWhere<DocumentEntity> = { id: documentId };
    if (user.clientId) whereOptions.client = { id: user.clientId };
    const document = await this.documentRepository.findOneOrFail({
      where: whereOptions,
      relations: { parentGroup: true },
    });
    if (user.role === UserRole.ADMIN) return true;
    if (document.isPrivate) return await this.hasPrivateAccessToEntity(document.id, PermissionEntityType.DOCUMENT);
    if (document.parentGroup) {
      return await this.hasReadAccessToDocumentGroup(document.parentGroup.id, userToCheckId);
    }
    const documentWithRoot = await this.documentRepository.findOneOrFail({
      where: { id: documentId },
      relations: { rootGroup: { parentProject: true } },
    });

    if (documentWithRoot.rootGroup.parentProject)
      return await this.hasReadAccessToProject(documentWithRoot.rootGroup.parentProject.id, userToCheckId);

    return true;
  }

  private async hasReadAccessToProject(projectId: string, userToCheckId: string | undefined) {
    const user = this.getUser(userToCheckId);
    const whereOptions: FindOptionsWhere<ProjectEntity> = { id: projectId };
    if (user.clientId) whereOptions.client = { id: user.clientId };
    const project = await this.projectRepository.findOneOrFail({
      where: whereOptions,
    });
    if (user.role === UserRole.ADMIN) return true;
    if (project.isPrivate) return await this.hasPrivateAccessToEntity(project.id, PermissionEntityType.PROJECT);
    return true;
  }

  async hasReadAccessToEntity(entityId: string, entityType: PermissionEntityType, userToCheckId?: string) {
    if (entityType === PermissionEntityType.TICKET_BOARD)
      return await this.hasReadAccessToTicketBoard(entityId, userToCheckId);

    if (entityType === PermissionEntityType.CORRESPONDENCE_GROUP)
      return await this.hasReadAccessToCorrespondenceGroup(entityId, userToCheckId);

    if (entityType === PermissionEntityType.CORRESPONDENCE)
      return await this.hasReadAccessToCorrespondence(entityId, userToCheckId);

    if (entityType === PermissionEntityType.DOCUMENT_GROUP)
      return await this.hasReadAccessToDocumentGroup(entityId, userToCheckId);

    if (entityType === PermissionEntityType.DOCUMENT)
      return await this.hasReadAccessToDocument(entityId, userToCheckId);

    if (entityType === PermissionEntityType.PROJECT) return await this.hasReadAccessToProject(entityId, userToCheckId);

    throw new Error("unknown state");
  }

  async getEntityIsPrivate(entityId: string, entityType: PermissionEntityType) {
    const currentUser = getCurrentUser();

    if (entityType === PermissionEntityType.TICKET_BOARD) {
      return (
        await this.ticketBoardRepository.findOneOrFail({
          where: { id: entityId, client: { id: currentUser.clientId } },
        })
      ).isPrivate;
    }

    if (entityType === PermissionEntityType.CORRESPONDENCE_GROUP)
      return (
        await this.correspondenceGroupRepository.findOneOrFail({
          where: { id: entityId, client: { id: currentUser.clientId } },
        })
      ).isPrivate;

    if (entityType === PermissionEntityType.CORRESPONDENCE)
      return (
        await this.correspondenceRepository.findOneOrFail({
          where: { id: entityId, client: { id: currentUser.clientId } },
        })
      ).isPrivate;

    if (entityType === PermissionEntityType.DOCUMENT_GROUP)
      return (
        await this.documentGroupRepository.findOneOrFail({
          where: { id: entityId, client: { id: currentUser.clientId } },
        })
      ).isPrivate;

    if (entityType === PermissionEntityType.DOCUMENT)
      return (
        await this.documentRepository.findOneOrFail({ where: { id: entityId, client: { id: currentUser.clientId } } })
      ).isPrivate;

    if (entityType === PermissionEntityType.PROJECT)
      return (
        await this.projectRepository.findOneOrFail({ where: { id: entityId, client: { id: currentUser.clientId } } })
      ).isPrivate;

    throw new Error("unknown state");
  }
}
