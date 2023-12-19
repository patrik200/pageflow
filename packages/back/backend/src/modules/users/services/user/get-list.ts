import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, In, Repository } from "typeorm";
import { convertSortingToElasticSearch, ElasticService } from "@app/back-kit";

import { UserEntity } from "entities/User";

import { getCurrentUser } from "modules/auth";

import { UserSorting } from "../../types";

interface GetUsersQueryInterface {
  search?: string;
  getDeleted?: boolean;
  sorting?: UserSorting;
}

@Injectable()
export class GetUserListService {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private elasticService: ElasticService,
  ) {}

  async getUsersListOrFail(criteria: GetUsersQueryInterface, options: { loadAvatar?: boolean } = {}) {
    const currentUser = getCurrentUser();
    const searchResults = await this.elasticService.searchQueryMatchOrFail<{
      name: string;
      email: string;
    }>(
      "users",
      {
        query: {
          bool: {
            must: [
              { term: { clientId: currentUser.clientId } },
              criteria.search ? { multi_match: { query: criteria.search, fields: ["name", "email"] } } : undefined!,
            ].filter(Boolean),
          },
        },
      },
      { sorting: convertSortingToElasticSearch(criteria.sorting) },
    );

    const unsortedUsers = await this.usersRepository.find({
      where: {
        id: In(searchResults.hits.map((hit) => hit._id)),
      },
      withDeleted: criteria.getDeleted,
      relations: {
        avatar: options.loadAvatar,
      },
    });

    const users = searchResults.hits.map((hit) => unsortedUsers.find((user) => user.id === hit._id)!).filter(Boolean);

    users.forEach((user) => user.calculateAllCans(currentUser));

    return users;
  }

  async dangerGetUsersList(findOptions: FindManyOptions<UserEntity>) {
    return await this.usersRepository.find(findOptions);
  }
}
