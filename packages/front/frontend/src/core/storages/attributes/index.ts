import { METHODS } from "@app/kit";
import { Inject, Service } from "typedi";
import { action } from "mobx";
import { InternalRequestManager, parseServerError, Storage } from "@app/front-kit";
import { AttributeCategory } from "@app/shared-enums";

import { arrayOfAttributeTypeEntities, arrayOfAttributeValueEntities } from "core/entities/attributes/attribute";

@Service()
export class AttributesStorage extends Storage {
  static token = "AttributesStorage";

  constructor() {
    super();
    this.initStorage(AttributesStorage.token);
  }

  @Inject() private requestManager!: InternalRequestManager;

  @action getAttributeTypes = async (category: AttributeCategory) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/attributes/{category}/types",
        method: METHODS.GET,
        serverDataEntityDecoder: arrayOfAttributeTypeEntities,
        responseDataFieldPath: ["types"],
      })({ urlParams: { category } });
      return { success: true, types: array } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };

  @action getAttributeValues = async (category: AttributeCategory, attributeTypeKey: string) => {
    try {
      const { array } = await this.requestManager.createRequest({
        url: "/attributes/{category}/values",
        method: METHODS.GET,
        serverDataEntityDecoder: arrayOfAttributeValueEntities,
        responseDataFieldPath: ["values"],
      })({ urlParams: { category }, body: { attributeTypeKey } });
      return { success: true, values: array } as const;
    } catch (error) {
      return { success: false, error: parseServerError(error) } as const;
    }
  };
}
