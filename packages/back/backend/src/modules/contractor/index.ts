import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ContractorEntity } from "entities/Contractor";

import { ContractorsController } from "./controllers";

import { CreateContractorsService } from "./services/contractor/create";
import { EditContractorsService } from "./services/contractor/edit";
import { GetContractorsService } from "./services/contractor/get";
import { GetContractorsListService } from "./services/contractor/get-list";
import { ValidateForEditingContractorsService } from "./services/contractor/validate-for-editing";
import { EditContractorsLogoService } from "./services/logo/edit";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ContractorEntity])],
  controllers: [ContractorsController],
  providers: [
    CreateContractorsService,
    EditContractorsService,
    GetContractorsService,
    GetContractorsListService,
    ValidateForEditingContractorsService,
    EditContractorsLogoService,
  ],
  exports: [
    CreateContractorsService,
    EditContractorsService,
    GetContractorsService,
    GetContractorsListService,
    ValidateForEditingContractorsService,
    EditContractorsLogoService,
  ],
})
export class ContractorsModule {}

export * from "./services/contractor/create";
export * from "./services/contractor/edit";
export * from "./services/contractor/get";
export * from "./services/contractor/get-list";
export * from "./services/contractor/validate-for-editing";
export * from "./services/logo/edit";
