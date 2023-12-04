import { ServiceError } from "@app/back-kit";
import { PermissionRole, UserRole } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { promiseQueue } from "@worksolutions/utils";

import { PermissionEntity } from "entities/Permission";

import { getCurrentUser } from "modules/auth";

import { PermissionAccessService, PermissionIdentifier } from "./access";

export interface CreatePermissionInterface {
  userId: string;
  role: PermissionRole;
  canEditReaderPermissions?: boolean;
  canEditEditorPermissions?: boolean;
}

interface CreatePermissionOptionsInterface {
  validateCurrentUserPermissions: boolean;
}

@Injectable()
export class CreatePermissionService {
  constructor(
    @InjectRepository(PermissionEntity) private permissionRepository: Repository<PermissionEntity>,
    private permissionAccessService: PermissionAccessService,
  ) {}

  private queue = promiseQueue(1);

  @Transactional()
  private async realCreatePermissionOrFail(
    identifier: PermissionIdentifier,
    data: CreatePermissionInterface,
    { validateCurrentUserPermissions }: CreatePermissionOptionsInterface,
  ) {
    const currentUserPermission = validateCurrentUserPermissions
      ? await this.validateToCreatePermission(identifier, data)
      : undefined;

    const currentUser = getCurrentUser();

    const alreadySavedPermission = await this.permissionRepository.findOne({
      where: {
        entityId: identifier.entityId,
        entityType: identifier.entityType,
        client: { id: currentUser.clientId },
        user: { id: data.userId },
      },
    });

    if (!alreadySavedPermission) {
      await this.permissionRepository.save({
        entityId: identifier.entityId,
        entityType: identifier.entityType,
        client: { id: currentUser.clientId },
        user: { id: data.userId },
        role: data.role,
        ...this.getPermissionModifiers(data, currentUserPermission),
      });
      return;
    }

    if (data.role === PermissionRole.OWNER) {
      await this.permissionRepository.update(alreadySavedPermission.id, {
        role: data.role,
        ...this.getPermissionModifiers(data, currentUserPermission),
      });
    }

    if (data.role === PermissionRole.EDITOR) {
      if (alreadySavedPermission.role === PermissionRole.OWNER) return;
      await this.permissionRepository.update(alreadySavedPermission.id, {
        role: data.role,
        ...this.getPermissionModifiers(data, currentUserPermission),
      });
    }

    if (data.role === PermissionRole.READER) {
      if (alreadySavedPermission.role === PermissionRole.OWNER) return;
      if (alreadySavedPermission.role === PermissionRole.EDITOR) return;
      await this.permissionRepository.update(alreadySavedPermission.id, {
        role: data.role,
        ...this.getPermissionModifiers(data, currentUserPermission),
      });
    }
  }

  async createPermissionOrFail(
    identifier: PermissionIdentifier,
    data: CreatePermissionInterface,
    options: CreatePermissionOptionsInterface,
  ) {
    await this.queue(() => this.realCreatePermissionOrFail(identifier, data, options));
  }

  private getPermissionModifiers(data: CreatePermissionInterface, currentUserPermission: PermissionEntity | undefined) {
    if (data.role === PermissionRole.OWNER)
      return { canEditEditorPermissions: undefined, canEditReaderPermissions: undefined };

    if (data.role === PermissionRole.EDITOR) {
      if (currentUserPermission)
        return {
          canEditReaderPermissions: undefined,
          canEditEditorPermissions: currentUserPermission.canEditEditorPermissions
            ? !!data.canEditEditorPermissions
            : false,
        };

      return { canEditReaderPermissions: undefined, canEditEditorPermissions: !!data.canEditEditorPermissions };
    }

    if (data.role === PermissionRole.READER) {
      if (currentUserPermission)
        return {
          canEditEditorPermissions: undefined,
          canEditReaderPermissions: currentUserPermission.canEditReaderPermissions
            ? !!data.canEditReaderPermissions
            : false,
        };

      return { canEditEditorPermissions: undefined, canEditReaderPermissions: !!data.canEditReaderPermissions };
    }

    throw new Error("Unknown state");
  }

  private async validateToCreatePermission(
    identifier: PermissionIdentifier,
    givePermission: CreatePermissionInterface,
  ) {
    if (givePermission.role === PermissionRole.OWNER)
      throw new ServiceError("permission", "Невозможно выдать роль владельца");

    const currentUser = getCurrentUser();
    if (currentUser.role === UserRole.ADMIN) return;

    if (givePermission.role === PermissionRole.READER) {
      const entityIsPrivate = await this.permissionAccessService.getEntityIsPrivate(
        identifier.entityId,
        identifier.entityType,
      );
      if (!entityIsPrivate) {
        await this.permissionAccessService.validateToRead(identifier, true);
        return;
      }
    }

    const currentUserPermission = await this.permissionRepository.findOneOrFail({
      where: {
        entityType: identifier.entityType,
        entityId: identifier.entityId,
        user: { id: currentUser.userId },
      },
    });

    if (currentUserPermission.role === PermissionRole.OWNER) return currentUserPermission;

    if (givePermission.role === PermissionRole.EDITOR) {
      if (currentUserPermission.role === PermissionRole.EDITOR) return currentUserPermission;

      throw new ServiceError("permission", "У вас недостаточно прав для выдачи роли");
    }

    if (givePermission.role === PermissionRole.READER) {
      if (currentUserPermission.role === PermissionRole.EDITOR) return currentUserPermission;
      if (currentUserPermission.role === PermissionRole.READER) return currentUserPermission;

      throw new ServiceError("permission", "У вас недостаточно прав для выдачи роли");
    }
  }
}
