import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserFlowEntity } from "entities/UserFlow";
import { UserFlowReviewerEntity } from "entities/UserFlow/Reviewer";
import { UserFlowRowEntity } from "entities/UserFlow/Row";
import { UserFlowRowUserEntity } from "entities/UserFlow/Row/User";

import { UserFlowController } from "./controllers";

import { GetUserFlowService } from "./services/get";
import { EditUserFlowService } from "./services/edit";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserFlowEntity, UserFlowReviewerEntity, UserFlowRowEntity, UserFlowRowUserEntity]),
  ],
  controllers: [UserFlowController],
  providers: [GetUserFlowService, EditUserFlowService],
  exports: [GetUserFlowService, EditUserFlowService],
})
export class UserFlowModule {}

export * from "./services/get";
export * from "./services/edit";
