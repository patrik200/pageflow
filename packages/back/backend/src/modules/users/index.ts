import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "entities/User";

import { UsersController } from "./controllers";

import { DeleteUserAvatarService } from "./services/avatar/delete";
import { EditUserAvatarService } from "./services/avatar/edit";
import { ControllerValidatorEditUserService } from "./services/controller-validator";
import { CreateUserService } from "./services/user/create";
import { CreateUserElasticService } from "./services/user/create-elastic";
import { DeleteUserService } from "./services/user/delete";
import { GetUserService } from "./services/user/get";
import { EditUserService } from "./services/user/edit";
import { InitElasticUserService } from "./services/init";
import { ResetPasswordService } from "./services/password/resetPassword";
import { GetUserForUpdateService } from "./services/user/get-for-update";
import { GetUserListService } from "./services/user/get-list";
import { RestoreUserService } from "./services/user/restore";
import { UserUnavailableUntilSetterService } from "./services/background/unavailable-setter";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    GetUserService,
    EditUserService,
    ControllerValidatorEditUserService,
    InitElasticUserService,
    ResetPasswordService,
    CreateUserService,
    DeleteUserService,
    GetUserForUpdateService,
    GetUserListService,
    RestoreUserService,
    DeleteUserAvatarService,
    EditUserAvatarService,
    CreateUserElasticService,
    UserUnavailableUntilSetterService,
  ],
  exports: [
    GetUserService,
    EditUserService,
    InitElasticUserService,
    CreateUserService,
    CreateUserService,
    DeleteUserService,
    GetUserForUpdateService,
    GetUserListService,
    RestoreUserService,
    DeleteUserAvatarService,
    EditUserAvatarService,
    CreateUserElasticService,
  ],
})
export class UsersModule {
  constructor(initElasticUserService: InitElasticUserService) {
    initElasticUserService.appBootstrap();
  }
}

export * from "./services/avatar/delete";
export * from "./services/avatar/edit";
export * from "./services/user/create";
export * from "./services/user/create-elastic";
export * from "./services/user/delete";
export * from "./services/user/edit";
export * from "./services/user/get";
export * from "./services/user/get-for-update";
export * from "./services/user/get-list";
export * from "./services/user/restore";
export * from "./services/controller-validator";
export * from "./services/init";

export * from "./dto/Profile";
