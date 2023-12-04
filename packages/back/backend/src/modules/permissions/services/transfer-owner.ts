import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TicketBoardEntity } from "entities/TicketBoard";

import { PermissionEntity } from "../../../entities/Permission";

@Injectable()
export class TransferTicketBoardPermissionOwnerService {
  constructor(
    @InjectRepository(TicketBoardEntity)
    private boardRepository: Repository<TicketBoardEntity>,
    @InjectRepository(PermissionEntity)
    private permissionsRepository: Repository<PermissionEntity>,
  ) {}

  // @Transactional()
  // async transferPermissionOwnerOrFail(identifierOptions: { boardId: string },
  // data: TransferPermissionOwnerInterface) {
  //   const { clientId, userId } = getCurrentUser();
  //   const currentUserPermission = await this.permissionsRepository.findOneOrFail({
  //     where: { board: { id: identifierOptions.boardId }, user: { id: userId } },
  //   });
  //
  //   this.validateToTransferPermission(currentUserPermission, data);
  //
  //   const board = await this.boardRepository.findOneOrFail({
  //     where: { id: identifierOptions.boardId, client: { id: clientId } },
  //   });
  //
  //   const [savedPermissionId] = await Promise.all([
  //     this.createPermissionForNewOwner(data, board),
  //     this.editPermissionForOldOwner(currentUserPermission.id, data.newRoleForCurrentUser),
  //   ]);
  //
  //   return savedPermissionId;
  // }
  //
  // private async createPermissionForNewOwner(data: TransferPermissionOwnerInterface, board: TicketBoardEntity) {
  //   const newOwnerOldPermission = await this.permissionsRepository.findOne({
  //     where: { board: { id: board.id }, user: { id: data.userId } },
  //   });
  //
  //   if (newOwnerOldPermission) {
  //     await this.permissionsRepository.update(
  //       { id: newOwnerOldPermission.id },
  //       {
  //         role: PermissionRole.OWNER,
  //         canEditEditorPermissions: true,
  //         canEditReaderPermissions: true,
  //       },
  //     );
  //     return newOwnerOldPermission.id;
  //   }
  //
  //   const newOwnerPermission = await this.permissionsRepository.save({
  //     board: { id: board.id },
  //     user: { id: data.userId },
  //     role: PermissionRole.OWNER,
  //     canEditEditorPermissions: true,
  //     canEditReaderPermissions: true,
  //   });
  //
  //   return newOwnerPermission.id;
  // }
  //
  // private async editPermissionForOldOwner(permissionId: string, newRoleForCurrentUser: PermissionRole | null) {
  //   if (newRoleForCurrentUser) {
  //     await this.permissionsRepository.update(permissionId, { role: newRoleForCurrentUser });
  //     return;
  //   }
  //
  //   await this.permissionsRepository.delete(permissionId);
  // }
  //
  // private validateToTransferPermission(
  //   userPermission: TicketBoardPermissionsEntity,
  //   givePermission: TransferPermissionOwnerInterface,
  // ) {
  //   if (givePermission.newRoleForCurrentUser === PermissionRole.OWNER)
  //     throw new ServiceError("permission", "Невозможно поменять на роль владельца");
  //
  //   if (userPermission.role !== PermissionRole.OWNER)
  //     throw new ServiceError("permission", "Передать роль владельца может только владелец");
  //
  //   const { userId } = getCurrentUser();
  //   if (givePermission.userId === userId)
  //     throw new ServiceError("permission", "Невозможно передать права владельца себе");
  // }
}
