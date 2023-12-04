import { UserRole } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "entities/User";

import { AuthUserEntity } from "types/express";

import { RequestCreateUserDTO } from "../dto/CreateUser";
import { RequestUpdateUserDTO } from "../dto/UpdateUser";

@Injectable()
export class ControllerValidatorEditUserService {
  constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {}

  canCreateUserWithRole(myUser: AuthUserEntity, targetUser: RequestCreateUserDTO) {
    if (myUser.role === UserRole.ADMIN) return true;
    if (targetUser.role === UserRole.ADMIN) return false;
    return true;
  }

  canUpdateUserRole(myUser: AuthUserEntity, targetUser: RequestUpdateUserDTO) {
    if (!targetUser.role) return true;
    if (myUser.role === UserRole.ADMIN) return true;
    return false;
  }

  canUpdateUserEmail(myUser: AuthUserEntity, targetUser: RequestUpdateUserDTO) {
    if (!targetUser.email) return true;
    if (myUser.role === UserRole.ADMIN) return true;
    return false;
  }
}
