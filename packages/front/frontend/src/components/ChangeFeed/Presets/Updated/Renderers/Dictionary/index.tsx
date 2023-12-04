import React from "react";
import { useViewContext } from "@app/front-kit";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

import TextRenderer from "../Text";

interface DictionaryRendererInterface {
  value: string | null;
  options: Record<string, any>;
}

function DictionaryRenderer({ value, options }: DictionaryRendererInterface) {
  const { dictionaries } = useViewContext().containerInstance.get(DictionariesCommonStorage);
  const dictionaryValue = React.useMemo(() => {
    if (!value) return null;
    const dictionary = dictionaries.find((dictionary) => dictionary.type === options.dictionaryType)!;
    return dictionary.values.find((dictionaryValue) => dictionaryValue.key === value)?.value ?? value;
  }, [dictionaries, options.dictionaryType, value]);
  return <TextRenderer value={dictionaryValue} />;
}

export default React.memo(DictionaryRenderer);
