import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";

import { GetClientService } from "modules/clients";

@Injectable()
export class ValidateDomainLandingService {
  constructor(@Inject(forwardRef(() => GetClientService)) private getClientService: GetClientService) {}

  async validateDomain(domain: string) {
    const alreadyCreatedClient = await this.getClientService.getClientIdByDomainOrFail(domain);
    if (alreadyCreatedClient) throw new ServiceError("error", "domain_already_created");
  }
}
