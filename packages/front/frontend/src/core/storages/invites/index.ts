import { action } from "mobx";
import { Inject, Service } from "typedi";
import { InternalRequestManager, Storage, parseServerError } from "@app/front-kit";
import { METHODS } from "@app/kit";

import { IdEntity } from "core/entities/id";
import { InvitationPayloadEntity } from "core/entities/invitation";

import { InvitationEntity } from "./entities/Invitation";
import { EditUserEntity } from "../user/entities/EditUser";

@Service()
export class InvitationStorage extends Storage {
  static token = "InvitesStorage";

  constructor() {
    super();
    this.initStorage(InvitationStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;

  @action createInvitation = async (entity: InvitationEntity) => {
    try {
      const res = await this.requestManager.createRequest({
        url: "/invitations/create",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({
        body: entity.apiCreateReady,
      });

      return { success: true, res } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action verifyInvitation = async (inviationToken: string) => {
    try {
      const invitation = await this.requestManager.createRequest({
        url: `/invitations/verify`,
        method: METHODS.POST,
        serverDataEntityDecoder: InvitationPayloadEntity,
      })({ body: { token: inviationToken } });

      return { success: true, invitation } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action createUserByInvitation = async (entity: EditUserEntity, invitationToken: string) => {
    try {
      const { id } = await this.requestManager.createRequest({
        url: "/invitations/submit",
        method: METHODS.POST,
        serverDataEntityDecoder: IdEntity,
      })({
        body: { ...entity.apiCreateReady, invitation: invitationToken },
      });
      return { success: true, userId: id } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
