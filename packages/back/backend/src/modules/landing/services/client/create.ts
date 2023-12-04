import { CryptoService, errorLogBeautifier, ServiceError } from "@app/back-kit";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

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
  ) {}

  private async createClient(domain: string, options: CreateClientOptions) {
    return await this.createClientService.createClientOrFail({
      name: options.companyName,
      domain,
      tariff: Tariffs.START,
      filesMemoryLimitByte: options.filesMemoryLimitByte,
      includeSubdomainForDomainValidator: true,
      addTrial: true,
    });
  }

  @Transactional()
  async createClientInBackgroundOrFail(domain: string, options: CreateClientOptions) {
    console.log("Create client in background");
    try {
      const clientId = await this.createClient(domain, options);
      console.log("Client created");
      const password = this.cryptoService.generateRandom(12);
      console.log("Password generated");
      await this.createAdminLandingService.createAdmin(clientId, password, options);
      console.log("Admin created");
      await this.sendEmailLandingService.sendEmail(domain, options.email, password);
      console.log("Email sent");
    } catch (e) {
      console.log("Create client in background error");
      errorLogBeautifier(e);
      throw e;
    }
  }

  private validateOptions(options: CreateClientOptions) {
    const userDomain = options.domain.replaceAll(/[^a-zA-Z0-9-]/g, "");
    if (userDomain !== options.domain) throw new ServiceError("error", "bad_domain");
    if (userDomain === "api") throw new ServiceError("error", "bad_domain");
    if (userDomain === "pageflow") throw new ServiceError("error", "bad_domain");
  }

  @Transactional()
  async createClientOrFail(options: CreateClientOptions) {
    this.validateOptions(options);

    const domain = `${options.domain}.pageflow.ru`;
    await this.validateDomainLandingService.validateDomain(domain);

    await this.createClientInBackgroundOrFail(domain, options);
  }
}
