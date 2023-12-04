import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { OnlyBrowser } from "@app/ui-kit";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

import DictionaryCard from "./DictionaryCard";

import { wrapperStyles } from "./style.css";

function SettingsDictionariesView() {
  const { dictionaries } = useViewContext().containerInstance.get(DictionariesCommonStorage);
  return (
    <div className={wrapperStyles}>
      {dictionaries.map((dictionary) => (
        <DictionaryCard key={dictionary.id} dictionary={dictionary} />
      ))}
    </div>
  );
}

export default OnlyBrowser(observer(SettingsDictionariesView));
