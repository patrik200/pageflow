import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpressMultipartFile, ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";

import { UserEntity } from "entities/User";

import { getCurrentUser } from "modules/auth";
import { DeleteFileService, UploadFileService } from "modules/storage";

interface UpdateUserAvatarInterface {
  file: ExpressMultipartFile;
}

@Injectable()
export class EditUserAvatarService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private deleteFileService: DeleteFileService,
    private uploadFileService: UploadFileService,
  ) {}

  private async getUserForUpdating(userId: string) {
    const currentUser = getCurrentUser();
    const user = await this.usersRepository.findOneOrFail({
      where: { id: userId, client: { id: currentUser.clientId }, system: false },
      relations: { client: true, avatar: true },
      withDeleted: true,
    });
    user.calculateAllCans(currentUser);
    if (!user.canUpdate) throw new ServiceError("user", "Вы не можете обновить этого пользователя");
    return user;
  }

  @Transactional()
  async updateUserAvatarOrFail(userId: string, { file }: UpdateUserAvatarInterface) {
    const user = await this.getUserForUpdating(userId);

    if (user.avatar) await this.deleteFileService.deleteFileOrFail(user.avatar);

    const savedFile = await this.uploadFileService.uploadFileOrFail(
      `client.${user.client.id}.user-avatars`,
      file,
      "image",
    );

    await this.usersRepository.update(user.id, {
      avatar: { id: savedFile.id },
    });

    return savedFile;
  }
}
