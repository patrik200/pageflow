import { Body, Controller, Get, Param, Patch, Post, Query, Delete } from "@nestjs/common";
import { ControllerResponse, ServiceError } from "@app/back-kit";
import { GetGoalService } from "../service/goal/get";
import { CreateGoalsService } from "../service/goal/create";
import { ResponseGoalDTO } from "../dto/get/Goal";
import { RequestCreateGoalDTO } from "../dto/edit/CreateGoal";
import { RequestEditGoalDTO } from "../dto/edit/EditGoal";
import { ResponseIdDTO } from "constants/ResponseId";
import { GetGoalsListService } from "../service/goal/get-list";
import { withUserAuthorized } from "modules/auth";
import { UserRole } from "@app/shared-enums";
import { GoalEditService } from "../service/goal/edit";

@Controller("goals")
export class GoalController {
    constructor(
        private getGoalService: GetGoalService,
        private createGoalsService: CreateGoalsService,
        private getGoalsListService: GetGoalsListService,
        private editGoalService: GoalEditService,
    ){}
    

    @Get(":id")
    async getGoal(@Param("id") id: string) {
        const goal = await this.getGoalService.getGoalOrFail(id)
        return new ControllerResponse(ResponseGoalDTO, goal)
    }
    
    @Post("goal")
    @withUserAuthorized([UserRole.USER])
    async createGoal(@Body() body: RequestCreateGoalDTO) {
        const id = await this.createGoalsService.createGoalOrFail({
            name: body.name,
            description: body.description,
            projectId: body.projectId!
        })
        return new ControllerResponse(ResponseIdDTO, { id });
    }
    @Patch(":id")
    @withUserAuthorized([UserRole.USER])
    async updateGoal(@Param("id") id: string, @Body() body: RequestEditGoalDTO) {
        await this.editGoalService.editGoalOrFail(id, body)
    }
}