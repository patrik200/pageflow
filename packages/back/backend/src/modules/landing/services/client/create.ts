import { CryptoService, SentryTextService, ServiceError } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { config } from "@app/core-config";

import { Tariffs } from "fixtures/tariffs";

import { CreateClientService } from "modules/clients";

import { CreateAdminLandingService } from "../admin/create";
import { SendEmailLandingService } from "../email/send";
import { ValidateDomainLandingService } from "../domain/validate";

interface CreateClientOptions {
  name: string;
  companyName: string;
  domain: string;
  email: string;
  filesMemoryLimitByte: number | null;
}

@Injectable()
export class CreateClientLandingService {
  constructor(
    @Inject(forwardRef(() => CreateClientService)) private createClientService: CreateClientService,
    private createAdminLandingService: CreateAdminLandingService,
    private sendEmailLandingService: SendEmailLandingService,
    private validateDomainLandingService: ValidateDomainLandingService,
    private cryptoService: CryptoService,
    private sentryTextService: SentryTextService,
  ) {}

  private async createClient(domain: string, options: CreateClientOptions) {
    return await this.createClientService.createClientOrFail({
      name: options.companyName,
      domain,
      tariff: Tariffs.START,
      filesMemoryLimitByte: options.filesMemoryLimitByte,
      addTrial: true,
    });
  }

  @Transactional()
  async createClientInBackgroundOrFail(domain: string, options: CreateClientOptions) {
    try {
      const clientId = await this.createClient(domain, options);
      const password = this.cryptoService.generateRandom(12);
      await this.createAdminLandingService.createAdmin(clientId, password, options);
      await this.sendEmailLandingService.sendEmail(domain, options.email, password);
    } catch (e) {
      this.sentryTextService.error(e, {
        context: "Create client in background error",
        contextService: "Create client landing",
      });
      throw e;
    }
  }

  private validateOptions(options: CreateClientOptions) {
    const userDomain = options.domain.replaceAll(/[^a-zA-Z0-9-]/g, "");
    if (userDomain !== options.domain) throw new ServiceError("error", "bad_domain");
    if (config.landing.domainsBlackList.has(userDomain)) throw new ServiceError("error", "bad_domain");
  }

  @Transactional()
  async createClientOrFail(options: CreateClientOptions) {
    this.validateOptions(options);

    const domain = `${options.domain}.pageflow.ru`;
    await this.validateDomainLandingService.validateDomain(domain);

    await this.createClientInBackgroundOrFail(domain, options);
  }
}
