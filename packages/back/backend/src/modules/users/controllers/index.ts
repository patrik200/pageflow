import { ControllerResponse, ServiceError, StorageFileDTO } from "@app/back-kit";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";

import { ResponseIdDTO } from "constants/ResponseId";

import { getCurrentUser, withUserAuthorized } from "modules/auth";

import { BaseExpressRequest } from "types/express";

import { DeleteUserAvatarService } from "../services/avatar/delete";
import { EditUserAvatarService } from "../services/avatar/edit";
import { ControllerValidatorEditUserService } from "../services/controller-validator";
import { CreateUserService } from "../services/user/create";
import { DeleteUserService } from "../services/user/delete";
import { GetUserService } from "../services/user/get";
import { EditUserService } from "../services/user/edit";
import { GetUserListService } from "../services/user/get-list";
import { RestoreUserService } from "../services/user/restore";
import { ResetPasswordService } from "../services/password/resetPassword";

import { RequestCreateUserDTO } from "../dto/CreateUser";
import { RequestUpdateUserDTO } from "../dto/UpdateUser";
import { ResponseProfileDTO } from "../dto/Profile";
import { RequestGetUsersDTO, ResponseGetUsersDTO } from "../dto/GetUsers";
import { RequestResetPasswordFinishDTO, RequestResetPasswordInitialDTO } from "../dto/ResetPassword";

@Controller("users")
export class UsersController {
  constructor(
    private deleteUserAvatarService: DeleteUserAvatarService,
    private editUserAvatarService: EditUserAvatarService,
    private createUserService: CreateUserService,
    private deleteUserService: DeleteUserService,
    private editUserService: EditUserService,
    private getUserService: GetUserService,
    private getUserListService: GetUserListService,
    private restoreUserService: RestoreUserService,
    private resetPasswordService: ResetPasswordService,
    private controllerValidatorEditUserService: ControllerValidatorEditUserService,
  ) {}

  @Get("profile")
  @withUserAuthorized([UserRole.USER])
  async getCurrentUser() {
    const user = await this.getUserService.getUserOrFail(getCurrentUser().userId, "id", { loadAvatar: true });
    return new ControllerResponse(ResponseProfileDTO, user);
  }

  @Get(":userId/profile")
  @withUserAuthorized([UserRole.USER])
  async getUser(@Param("userId") userId: string) {
    const user = await this.getUserService.getUserOrFail(userId, "id", { withDeleted: true, loadAvatar: true });
    return new ControllerResponse(ResponseProfileDTO, user);
  }

  @Patch(":userId/profile")
  @withUserAuthorized([UserRole.USER])
  async updateUser(@Param("userId") userId: string, @Body() body: RequestUpdateUserDTO) {
    const canUpdateUserRole = this.controllerValidatorEditUserService.canUpdateUserRole(getCurrentUser(), body);
    if (!canUpdateUserRole) throw new ServiceError("role", "Вы не можете обновить роль пользователя");

    const canUpdateUserEmail = this.controllerValidatorEditUserService.canUpdateUserEmail(getCurrentUser(), body);
    if (!canUpdateUserEmail) throw new ServiceError("email", "Вы не можете обновить email пользователя");

    await this.editUserService.updateUserOrFail(userId, {
      role: body.role,
      name: body.name,
      position: body.position,
      email: body.email,
      phone: body.phone,
      password: body.password,
      unavailableUntil: body.unavailableUntil,
    });
  }

  @Post(":userId/profile/avatar")
  @withUserAuthorized([UserRole.USER])
  async updateUserAvatar(@Param("userId") userId: string, @Req() req: BaseExpressRequest) {
    if (!req.files.file) throw new ServiceError("file", "Файл не отправлен");
    const file = await this.editUserAvatarService.updateUserAvatarOrFail(userId, { file: req.files.file });
    return new ControllerResponse(StorageFileDTO, file);
  }

  @Delete(":userId/profile/avatar")
  @withUserAuthorized([UserRole.USER])
  async deleteUserAvatar(@Param("userId") userId: string) {
    await this.deleteUserAvatarService.deleteUserAvatarOrFail(userId);
  }

  @Post("create")
  @withUserAuthorized([UserRole.USER])
  async create(@Body() body: RequestCreateUserDTO) {
    const canCreateUser = this.controllerValidatorEditUserService.canCreateUserWithRole(getCurrentUser(), body);
    if (!canCreateUser) throw new ServiceError("role", "Вы не можете создать пользователя с такой ролью");

    const user = await this.createUserService.createUserOrFail({
      email: body.email,
      phone: body.phone,
      position: body.position,
      role: body.role,
      name: body.name,
      password: body.password,
    });

    return new ControllerResponse(ResponseIdDTO, { id: user.id });
  }

  @Get("list")
  @withUserAuthorized([UserRole.USER])
  async list(@Query() criteria: RequestGetUsersDTO) {
    const usersList = await this.getUserListService.getUsersListOrFail(
      { search: criteria.search, getDeleted: criteria.searchWithDeleted, sorting: criteria.sorting },
      { loadAvatar: true },
    );

    return new ControllerResponse(ResponseGetUsersDTO, { list: usersList });
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @withUserAuthorized([UserRole.ADMIN])
  async deleteUser(@Param("id") userId: string) {
    await this.deleteUserService.deleteUserOfFail(userId);
  }

  @Post(":id/restore")
  @withUserAuthorized([UserRole.ADMIN])
  async restoreUser(@Param("id") userId: string) {
    await this.restoreUserService.restoreUserOrFail(userId);
  }

  @Post("reset-password/initial")
  async resetPasswordInitial(@Body() body: RequestResetPasswordInitialDTO) {
    await this.resetPasswordService.resetPasswordInitial(body.email, body.clientId);
  }

  @Post("reset-password/finish")
  async resetPasswordFinish(@Body() body: RequestResetPasswordFinishDTO) {
    const result = await this.resetPasswordService.resetPasswordFinish(body.token, body.password);
    if (!result) throw new ServiceError("token", "Неверный токен");
  }
}
