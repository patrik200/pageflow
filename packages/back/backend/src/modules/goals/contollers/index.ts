import { Body, Controller, Get, Param, Patch, Post, Delete } from "@nestjs/common";
import { ControllerResponse } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

import { ResponseIdDTO } from "constants/ResponseId";

import { withUserAuthorized } from "modules/auth";

import { GetGoalService } from "../service/goal/get";
import { CreateGoalsService } from "../service/goal/create";
import { GetGoalsListService } from "../service/goal/get-list";
import { GoalEditService } from "../service/goal/edit";
import { TimepointCreateService } from "../service/timepoint/create";
import { TimepointEditService } from "../service/timepoint/edit";
import { GetTimepointsListService } from "../service/timepoint/get-list";
import { DeleteGoalService } from "../service/goal/delete";
import { DeleteTimepointService } from "../service/timepoint/delete";

import { RequestEditTimepointDTO } from "../dto/edit/EditTimepoint";
import { RequestEditGoalDTO } from "../dto/edit/EditGoal";
import { RequestCreateTimePointDTO } from "../dto/edit/CreateTimePoint";
import { RequestCreateGoalDTO } from "../dto/edit/CreateGoal";
import { ResponseGoalDTO, ResponseGoalsListDTO } from "../dto/get/Goal";

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
  ) {}

  @Get("projects/:id")
  async getGoalsList(@Param("id") id: string) {
    const list = await this.getGoalsListService.getGoalsListOrFail({ projectId: id }, { loadTimepoints: true });
    return new ControllerResponse(ResponseGoalsListDTO, { list });
  }

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
  async updateTimePoint(@Param("id") id: string, @Body() body: RequestEditTimepointDTO) {
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
