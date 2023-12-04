import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GoalEntity } from "entities/Goal/Goal";

import { GoalController } from "./contollers";
import { CreateGoalsService } from "./service/goal/create";
import { GetGoalService } from "./service/goal/get";
import { GetGoalsListService } from "./service/goal/get-list";
import { NestModule } from "@app/back-kit";
import { GoalEditService } from "./service/goal/edit";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([
        GoalEntity,
       ]),
    ],
    controllers: [GoalController],
    providers: [
        CreateGoalsService,
        GetGoalService,
        GetGoalsListService,
        GoalEditService,
    ],
    exports: [
        CreateGoalsService,
        GetGoalService,
        GoalEditService,
        GetGoalsListService,
    ]
})
export class GoalModule implements NestModule{}

export * from "./service/goal/create"
export * from "./service/goal/get"
export * from "./service/goal/get-list"
export * from "./service/goal/edit"
