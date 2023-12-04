import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AttributeTypeEntity } from "entities/Attribute";
import { AttributeValueEntity } from "entities/Attribute/value";

import { AttributesController } from "./controllers";

import { GetOrCreateAttributeTypeService } from "./services/get-or-create-type";
import { GetOrCreateAttributeValueService } from "./services/get-or-create-value";
import { GetAttributeValuesService } from "./services/get-values";
import { GetAttributeTypesService } from "./services/get-keys";
import { UpdateAttributesService } from "./services/update";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AttributeTypeEntity, AttributeValueEntity])],
  controllers: [AttributesController],
  providers: [
    GetAttributeTypesService,
    GetOrCreateAttributeTypeService,
    GetOrCreateAttributeValueService,
    GetAttributeValuesService,
    UpdateAttributesService,
  ],
  exports: [
    GetAttributeTypesService,
    GetOrCreateAttributeTypeService,
    GetOrCreateAttributeValueService,
    GetAttributeValuesService,
    UpdateAttributesService,
  ],
})
export class AttributesModule {}

export * from "./services/get-keys";
export * from "./services/get-or-create-type";
export * from "./services/get-or-create-value";
export * from "./services/get-values";
export * from "./services/update";
