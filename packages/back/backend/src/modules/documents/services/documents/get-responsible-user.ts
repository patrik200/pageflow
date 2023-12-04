import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { GetUserService } from "modules/users";
import { GetUserFlowService, UserFlowSelectOptions } from "modules/userFlow/services/get";

@Injectable()
export class GetDocumentResponsibleUserService {
  constructor(
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
    @Inject(forwardRef(() => GetUserFlowService)) private getUserFlowService: GetUserFlowService,
  ) {}

  async getResponsibleUserIdOrFail(responsibleUserId: string) {
    const user = await this.getUserService.getUserOrFail(responsibleUserId, "id");
    return user.id;
  }

  async getResponsibleUserFlowOrFail(responsibleUserFlowId: string, options?: UserFlowSelectOptions) {
    return await this.getUserFlowService.getUserFlowOrFail(responsibleUserFlowId, options);
  }
}
