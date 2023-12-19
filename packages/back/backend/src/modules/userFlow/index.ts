import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserFlowEntity } from "entities/UserFlow";
import { UserFlowReviewerEntity } from "entities/UserFlow/Reviewer";
import { UserFlowRowEntity } from "entities/UserFlow/Row";
import { UserFlowRowUserEntity } from "entities/UserFlow/Row/User";

import { UserFlowController } from "./controllers";

import { GetUserFlowService } from "./services/get";
import { EditUserFlowService } from "./services/edit";
import { CreateUserFlowService } from "./services/create";
import { DeleteUserFlowService } from "./services/delete";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserFlowEntity, UserFlowReviewerEntity, UserFlowRowEntity, UserFlowRowUserEntity]),
  ],
  controllers: [UserFlowController],
  providers: [GetUserFlowService, EditUserFlowService, CreateUserFlowService, DeleteUserFlowService],
  exports: [GetUserFlowService, EditUserFlowService, CreateUserFlowService, DeleteUserFlowService],
})
export class UserFlowModule {}

export * from "./services/create";
export * from "./services/delete";
export * from "./services/get";
export * from "./services/edit";
