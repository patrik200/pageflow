import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GoalEntity } from "entities/Goal/";

import { GoalController } from "./contollers";
import { CreateGoalsService } from "./service/goal/create";
import { GetGoalService } from "./service/goal/get";
import { GetGoalsListService } from "./service/goal/get-list";
import { NestModule } from "@app/back-kit";
import { GoalEditService } from "./service/goal/edit";
import { TimepointEntity } from "entities/Timepoint";
import { TimepointCreateService } from "./service/timepoint/create";
import { TimepointEditService } from "./service/timepoint/edit";
import { GetTimepointsListService } from "./service/timepoint/get-list";
import { DeleteGoalService } from "./service/goal/delete";
import { DeleteTimepointService } from "./service/timepoint/delete";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([GoalEntity, TimepointEntity])],
    controllers: [GoalController],
    providers: [
        CreateGoalsService,
        GetGoalService,
        GetGoalsListService,
        GoalEditService,
        TimepointCreateService,
        TimepointEditService,
        GetTimepointsListService,
        DeleteGoalService,
        DeleteTimepointService,
    ],
    exports: [
        CreateGoalsService,
        GetGoalService,
        GoalEditService,
        GetGoalsListService,
        TimepointCreateService,
        TimepointEditService,
        GetTimepointsListService,
        DeleteGoalService,
        DeleteTimepointService,
    ],
})
export class GoalModule implements NestModule { }

export * from "./service/goal/create";
export * from "./service/goal/get";
export * from "./service/goal/get-list";
export * from "./service/goal/edit";
export * from "./service/timepoint/create";
export * from "./service/timepoint/edit";
export * from "./service/timepoint/get-list";
export * from "./service/goal/delete";
export * from "./service/timepoint/delete";
