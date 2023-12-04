import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CryptoService, ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { UserRole } from "@app/shared-enums";

import { UserEntity } from "entities/User";

import { getCurrentUser } from "modules/auth";

import { CreateUserElasticService } from "./create-elastic";

interface CreateUserInterface {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  position?: string;
  phone?: string;
  system?: boolean;
}

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private cryptoService: CryptoService,
    private createUserElasticService: CreateUserElasticService,
  ) {}

  @Transactional()
  async createUserOrFail(data: CreateUserInterface) {
    const currentUser = getCurrentUser();
    return this.createUserForClientOrFail(data, currentUser.clientId);
  }

  @Transactional()
  async createUserByInvitationOrFail(data: Omit<CreateUserInterface, "system"> & { clientId: string }) {
    return this.createUserForClientOrFail(data, data.clientId);
  }

  async createUserForClientOrFail(data: CreateUserInterface, clientId: string) {
    const alreadyExists = await this.usersRepository.findOne({
      where: { email: data.email, client: { id: clientId } },
    });
    if (alreadyExists) throw new ServiceError("email", "Пользователь уже существует");

    const savedUser = await this.usersRepository.save({
      client: { id: clientId },
      email: data.email,
      passwordHash: this.cryptoService.generateHash(data.password),
      role: data.role,
      name: data.name,
      position: data.position,
      phone: data.phone,
      system: data.system,
    });

    const user = await this.usersRepository.findOneOrFail({ where: { id: savedUser.id }, relations: { client: true } });
    if (!data.system) await this.createUserElasticService.createElasticIndexUserOrFail(user.id);

    return user;
  }
}
