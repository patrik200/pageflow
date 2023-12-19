import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";

import { UserEntity } from "entities/User";

import { getCurrentUser } from "modules/auth";
import { DeleteFileService } from "modules/storage";

@Injectable()
export class DeleteUserAvatarService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private deleteFileService: DeleteFileService,
  ) {}

  private async getUserForUpdating(userId: string) {
    const currentUser = getCurrentUser();
    const user = await this.usersRepository.findOneOrFail({
      where: { id: userId, client: { id: currentUser.clientId } },
      relations: { client: true, avatar: true },
      withDeleted: true,
    });
    user.calculateAllCans(currentUser);
    if (!user.canUpdate) throw new ServiceError("user", "Вы не можете обновить этого пользователя");
    return user;
  }

  @Transactional()
  async deleteUserAvatarOrFail(userId: string) {
    const user = await this.getUserForUpdating(userId);
    if (user.avatar) await this.deleteFileService.deleteFileOrFail(user.avatar);
    await this.usersRepository.update(user.id, { avatar: null });
  }
}
