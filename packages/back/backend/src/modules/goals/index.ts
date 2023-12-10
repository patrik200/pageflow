import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GoalEntity } from "entities/Goal/";

import { GoalController } from "./contollers";
import { CreateGoalsService } from "./service/goal/create";
import { GetGoalService } from "./service/goal/get";
import { GetGoalsListService } from "./service/goal/get-list";
import { NestModule } from "@app/back-kit";
import { GoalEditService } from "./service/goal/edit";
import { TimePointEntity } from "entities/TimePoint";
import { TimePointCreateService } from "./service/timePoint/create";
import { TimePointEditService } from "./service/timePoint/edit";
import { GetTimePointsListService } from "./service/timePoint/get-list";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([
        GoalEntity, TimePointEntity
       ]),
    ],
    controllers: [GoalController],
    providers: [
        CreateGoalsService,
        GetGoalService,
        GetGoalsListService,
        GoalEditService,
        TimePointCreateService,
        TimePointEditService,
        GetTimePointsListService,
    ],
    exports: [
        CreateGoalsService,
        GetGoalService,
        GoalEditService,
        GetGoalsListService,
        TimePointCreateService,
        TimePointEditService,
        GetTimePointsListService,
    ]
})
export class GoalModule implements NestModule{}

export * from "./service/goal/create"
export * from "./service/goal/get"
export * from "./service/goal/get-list"
export * from "./service/goal/edit"
export * from "./service/timePoint/create"
export * from "./service/timePoint/edit"
export * from "./service/timePoint/get-list"


