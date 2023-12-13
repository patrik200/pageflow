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
import { TimepointCreateService } from "../service/timepoint/create";
import { TimepointEditService } from "../service/timepoint/edit";
import { RequestEditTimePointDTO } from "../dto/edit/EditTimePoint";
import { GetTimepointsListService } from "../service/timepoint/get-list";
import { DeleteGoalService } from "../service/goal/delete";
import { DeleteTimepointService } from "../service/timepoint/delete";

@Controller("goals")
export class GoalController {
  constructor(
    private getGoalService: GetGoalService,
    private createGoalsService: CreateGoalsService,
    private getGoalsListService: GetGoalsListService,
    private editGoalService: GoalEditService,
    private createTimePointsService: TimepointCreateService,
    private editTimepointService: TimepointEditService,
    private getTimePointsListService: GetTimepointsListService,
    private deleteGoalService: DeleteGoalService,
    private deleteTimepointService: DeleteTimepointService,
  ) { }

  @Get(":id")
  async getGoal(@Param("id") id: string) {
    const goal = await this.getGoalService.getGoalOrFail(id);
    return new ControllerResponse(ResponseGoalDTO, goal);
  }

  @Post("goal")
  @withUserAuthorized([UserRole.USER])
  async createGoal(@Body() body: RequestCreateGoalDTO) {
    const id = await this.createGoalsService.createGoalOrFail({
      name: body.name,
      description: body.description,
      projectId: body.projectId!,
    });
    return new ControllerResponse(ResponseIdDTO, { id });
  }

  @Patch(":id")
  @withUserAuthorized([UserRole.USER])
  async updateGoal(@Param("id") id: string, @Body() body: RequestEditGoalDTO) {
    await this.editGoalService.editGoalOrFail(id, body);
  }

  @Post("timepoint")
  @withUserAuthorized([UserRole.USER])
  async createTimePoint(@Body() body: RequestCreateTimePointDTO) {
    const id = await this.createTimePointsService.createTimepointOrFail({
      name: body.name,
      description: body.description,
      goalId: body.goalId!,
      datePlan: body.datePlan!,
    });
    return new ControllerResponse(ResponseIdDTO, { id });
  }

  @Patch("timepoints/:id/edit/")
  @withUserAuthorized([UserRole.USER])
  async updateTimePoint(@Param("id") id: string, @Body() body: RequestEditTimePointDTO) {
    await this.editTimepointService.editTimepointOrFail(id, body);
  }

  @Delete(":id/delete/")
  @withUserAuthorized([UserRole.USER])
  async deleteGoal(@Param("goalId") goalId: string) {
    await this.deleteGoalService.deleteGoalOrFail(goalId);
  }

  @Delete("timepoints/:id/delete")
  @withUserAuthorized([UserRole.USER])
  async deleteTimePoint(@Param("timePointId") timePointId: string) {
    await this.deleteTimepointService.deleteTimepointOrFail(timePointId);
  }
}
