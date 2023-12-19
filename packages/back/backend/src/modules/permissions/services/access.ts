import { PermissionEntityType, PermissionRole, UserRole } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, In, Repository } from "typeorm";
import { ServiceError } from "@app/back-kit";

import { PermissionEntity } from "entities/Permission";

import { getCurrentUser } from "modules/auth";

import { PermissionAccessEntityService } from "./_accessEntity";

export interface PermissionIdentifier {
  entityId: string;
  entityType: PermissionEntityType;
}

export interface PermissionSelectOptions {
  loadUser?: boolean;
  loadUserAvatar?: boolean;
}

@Injectable()
export class PermissionAccessService {
  constructor(
    @InjectRepository(PermissionEntity) private permissionRepository: Repository<PermissionEntity>,
    private permissionAccessEntityService: PermissionAccessEntityService,
  ) {}

  async getPermissions(identifier: PermissionIdentifier, selectOptions: PermissionSelectOptions = {}) {
    const where: FindOptionsWhere<PermissionEntity> = {
      entityId: identifier.entityId,
      entityType: identifier.entityType,
    };
    where.client = { id: getCurrentUser().clientId };

    return await this.permissionRepository.find({
      where,
      order: { createdAt: "ASC" },
      relations: {
        user: selectOptions.loadUser
          ? {
              avatar: selectOptions.loadUserAvatar,
            }
          : false,
      },
    });
  }

  async loadPermissions<ENTITY extends { permissions?: PermissionEntity[] }>(
    identifier: PermissionIdentifier,
    entity: ENTITY,
    selectOptions?: PermissionSelectOptions,
  ) {
    entity.permissions = await this.getPermissions(identifier, selectOptions);
    return entity;
  }

  async validateToRead(identifier: PermissionIdentifier, throwException: boolean, userToCheckId?: string) {
    const hasAccess = await this.permissionAccessEntityService.hasReadAccessToEntity(
      identifier.entityId,
      identifier.entityType,
      userToCheckId,
    );
    if (hasAccess) return true;
    if (throwException) throw new ServiceError("permission", "Permission denied");
    return false;
  }

  async validateToEditOrDelete(identifier: PermissionIdentifier, throwException: boolean) {
    const currentUser = getCurrentUser();
    if (currentUser.role === UserRole.ADMIN) return true;
    const permission = await this.permissionRepository.findOne({
      where: {
        entityType: identifier.entityType,
        entityId: identifier.entityId,
        role: In([PermissionRole.OWNER, PermissionRole.EDITOR]),
        user: { id: currentUser.userId },
      },
    });
    if (permission) return true;
    if (throwException) throw new ServiceError("permission", "Permission denied");
    return false;
  }

  async getEntityIsPrivate(entityId: string, entityType: PermissionEntityType) {
    return await this.permissionAccessEntityService.getEntityIsPrivate(entityId, entityType);
  }
}
