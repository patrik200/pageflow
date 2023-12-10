import { Body, Controller, Get, Param, Patch, Post, Query, Delete } from "@nestjs/common";
import { ControllerResponse, ServiceError } from "@app/back-kit";
import { GetGoalService } from "../service/goal/get";
import { CreateGoalsService } from "../service/goal/create";
import { ResponseGoalDTO } from "../dto/get/Goal";
import { RequestCreateGoalDTO } from "../dto/edit/CreateGoal";
import { RequestCreateTimePointDTO } from "../dto/edit/CreateTimePoint";
import { RequestEditGoalDTO } from "../dto/edit/EditGoal";
import { ResponseIdDTO } from "constants/ResponseId";
import { GetGoalsListService } from "../service/goal/get-list";
import { withUserAuthorized } from "modules/auth";
import { UserRole } from "@app/shared-enums";
import { GoalEditService } from "../service/goal/edit";
import { TimePointCreateService } from "../service/timePoint/create";
import { TimePointEditService } from "../service/timePoint/edit";
import { RequestEditTimePointDTO } from "../dto/edit/EditTimePoint";
import { GetTimePointsListService } from "../service/timePoint/get-list";

@Controller("goals")
export class GoalController {
    constructor(
        private getGoalService: GetGoalService,
        private createGoalsService: CreateGoalsService,
        private getGoalsListService: GetGoalsListService,
        private editGoalService: GoalEditService,
        private createTimePointsService: TimePointCreateService,
        private editTimePointService: TimePointEditService,
        private getTimePointsListService: GetTimePointsListService,
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
    @Post("timepoint")
    @withUserAuthorized([UserRole.USER])
    async createTimePoint(@Body() body: RequestCreateTimePointDTO) {
        const id = await this.createTimePointsService.createTimePointOrFail({
            name: body.name,
            description: body.description,
            goalId: body.goalId!,
            startDatePlan: body.startDatePlan!,
            startDateFact: body.startDateFact!,
        })
        return new ControllerResponse(ResponseIdDTO, { id });
    }
    @Patch("timepoints/edit/:id")
    @withUserAuthorized([UserRole.USER])
    async updateTimePoint(@Param("id") id: string, @Body() body: RequestEditTimePointDTO) {
        await this.editTimePointService.editTimePointOrFail(id, body)
    }
}