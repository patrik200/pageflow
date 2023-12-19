import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";

import { UserFlowEntity } from "entities/UserFlow";

import { getCurrentUser } from "modules/auth";

export interface UserFlowSelectOptions {
  loadAuthorAvatar?: boolean;
  loadRows?: boolean;
  loadRowsUsers?: boolean;
  loadRowsUsersUser?: boolean;
  loadRowsUsersUserAvatar?: boolean;
  loadReviewer?: boolean;
  loadReviewerUser?: boolean;
  loadReviewerUserAvatar?: boolean;
}

@Injectable()
export class GetUserFlowService {
  constructor(@InjectRepository(UserFlowEntity) private userFlowRepository: Repository<UserFlowEntity>) {}

  async getUserFlowListOrFail(options: UserFlowSelectOptions = {}) {
    const currentUser = getCurrentUser();
    const userFlows = await this.userFlowRepository.find({
      where: { client: { id: currentUser.clientId } },
      order: { createdAt: "DESC" },
      relations: {
        author: {
          avatar: options.loadAuthorAvatar,
        },
        reviewer: options.loadReviewer
          ? {
              user: options.loadReviewerUser
                ? {
                    avatar: options.loadReviewerUserAvatar,
                  }
                : false,
            }
          : false,
        rows: options.loadRows
          ? {
              users: options.loadRowsUsers
                ? {
                    user: options.loadRowsUsersUser
                      ? {
                          avatar: options.loadRowsUsersUserAvatar,
                        }
                      : false,
                  }
                : false,
            }
          : false,
      },
    });
    userFlows.forEach((userFlow) => userFlow.calculateAllCans(currentUser));
    return userFlows;
  }

  async getUserFlowOrFail(userFlowId: string, options: UserFlowSelectOptions = {}) {
    const currentUser = getCurrentUser();
    const userFlow = await this.userFlowRepository.findOneOrFail({
      where: { id: userFlowId, client: { id: currentUser.clientId } },
      relations: {
        author: {
          avatar: options.loadAuthorAvatar,
        },
        reviewer: options.loadReviewer
          ? {
              user: options.loadReviewerUser
                ? {
                    avatar: options.loadReviewerUserAvatar,
                  }
                : false,
            }
          : false,
        rows: options.loadRows
          ? {
              users: options.loadRowsUsers
                ? {
                    user: options.loadRowsUsersUser
                      ? {
                          avatar: options.loadRowsUsersUserAvatar,
                        }
                      : false,
                  }
                : false,
            }
          : false,
      },
    });
    userFlow.rows?.sort((a, b) => a.sort - b.sort);
    userFlow.calculateAllCans(currentUser);
    return userFlow;
  }

  async dangerGetUserFlowsList(options?: FindManyOptions<UserFlowEntity>) {
    return await this.userFlowRepository.find(options);
  }
}
