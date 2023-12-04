import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";

import { GetClientsService } from "modules/clients";

@Injectable()
export class ValidateDomainLandingService {
  constructor(@Inject(forwardRef(() => GetClientsService)) private getClientsService: GetClientsService) {}

  async validateDomain(domain: string) {
    const alreadyCreatedClient = await this.getClientsService.getClientIdByDomain(domain);
    if (alreadyCreatedClient) throw new ServiceError("error", "domain_already_created");
  }
}
