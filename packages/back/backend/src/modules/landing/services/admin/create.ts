import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { UserRole } from "@app/shared-enums";

import { currentUserStorage, emptyCurrentUserStorageValue } from "modules/auth";
import { CreateUserService } from "modules/users";

interface CreateClientOptions {
  name: string;
  companyName: string;
  domain: string;
  email: string;
}

@Injectable()
export class CreateAdminLandingService {
  constructor(@Inject(forwardRef(() => CreateUserService)) private createUserService: CreateUserService) {}

  async createAdmin(clientId: string, password: string, options: CreateClientOptions) {
    await currentUserStorage.run({ ...emptyCurrentUserStorageValue, clientId }, () =>
      this.createUserService.createUserOrFail({
        role: UserRole.ADMIN,
        name: options.name,
        email: options.email,
        password,
        position: "ADMIN",
        phone: "",
      }),
    );
  }
}
