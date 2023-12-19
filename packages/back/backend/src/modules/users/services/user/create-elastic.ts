import { ElasticService } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "entities/User";

@Injectable()
export class CreateUserElasticService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private elasticService: ElasticService,
  ) {}

  async createElasticIndexUserOrFail(userId: string, refreshIndex?: boolean) {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: { client: true },
      withDeleted: true,
    });

    await this.elasticService.addDocumentOrFail(
      this.elasticService.getDocumentId("users", user.id),
      {
        clientId: user.client.id,
        role: user.role,
        name: user.name,
        email: user.email,
        position: user.position ?? "",
        phone: user.phone ?? "",
      },
      refreshIndex,
    );
  }
}
