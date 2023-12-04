import type { Constructable } from "typedi";
import type { MetadataStorage } from "class-transformer/types/MetadataStorage";

// eslint-disable-next-line prefer-const
export let classTransformerMetadataStorage: MetadataStorage = null!;

// replace-conditional-block-plugin-start cjs
// classTransformerMetadataStorage = require("class-transformer/cjs/storage").defaultMetadataStorage;
// replace-conditional-block-plugin-end

// replace-conditional-block-plugin-start es
// import { defaultMetadataStorage } from "class-transformer/esm5/storage";
// classTransformerMetadataStorage = defaultMetadataStorage;
// replace-conditional-block-plugin-end

export function getClassTransformerFieldMetadataType(target: Record<string, any>, key: string) {
  const transformerClass = classTransformerMetadataStorage.findTypeMetadata(target.constructor, key);
  if (transformerClass) return transformerClass.typeFunction() as Constructable<any>;
  return Reflect.getMetadata("design:type", target.constructor.prototype, key) as Constructable<any> | undefined;
}
