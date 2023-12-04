import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CryptoService, ElasticDocumentData, ElasticService, TypeormUpdateEntity } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { UserRole } from "@app/shared-enums";

import { UserEntity } from "entities/User";

import { GetUserForUpdateService } from "./get-for-update";

interface UpdateUserInterface {
  role?: UserRole;
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
  password?: string;
  unavailableUntil?: Date | null;
}

@Injectable()
export class EditUserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private cryptoService: CryptoService,
    private getUserForUpdateService: GetUserForUpdateService,
    private elasticService: ElasticService,
  ) {}

  @Transactional()
  async updateUserOrFail(userId: string, data: UpdateUserInterface) {
    const user = await this.getUserForUpdateService.getUserForUpdating(userId);

    const typeormUpdateData: TypeormUpdateEntity<UserEntity> = {};
    const elasticUpdateData: ElasticDocumentData = {};

    if (data.name !== undefined) {
      typeormUpdateData.name = data.name;
      elasticUpdateData.name = data.name;
    }
    if (data.role !== undefined) {
      typeormUpdateData.role = data.role;
      elasticUpdateData.role = data.role;
    }
    if (data.phone !== undefined) {
      typeormUpdateData.phone = data.phone;
      elasticUpdateData.phone = data.phone;
    }
    if (data.position !== undefined) {
      typeormUpdateData.position = data.position;
      elasticUpdateData.position = data.position;
    }
    if (data.email !== undefined) {
      typeormUpdateData.email = data.email;
      elasticUpdateData.email = data.email;
    }
    if (data.password !== undefined) {
      typeormUpdateData.passwordHash = this.cryptoService.generateHash(data.password);
    }
    if (data.unavailableUntil !== undefined) {
      typeormUpdateData.unavailableUntil = data.unavailableUntil;
    }

    await this.usersRepository.update(user.id, typeormUpdateData);
    await this.elasticService.updateDocumentOrFail(
      this.elasticService.getDocumentId("users", user.id),
      elasticUpdateData,
    );
  }
}
