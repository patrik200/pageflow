import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";
import { OnlyBrowser } from "@app/ui-kit";
import Masonry from "masonry-layout";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

import DictionaryCard from "./DictionaryCard";

import { itemStyles, wrapperStyles } from "./style.css";

function SettingsDictionariesView() {
  const { dictionaries } = useViewContext().containerInstance.get(DictionariesCommonStorage);
  const initMasonry = React.useCallback((ref: HTMLDivElement | null) => {
    if (!ref) return;
    new Masonry(ref, { itemSelector: "." + itemStyles, percentPosition: true });
  }, []);

  return (
    <div ref={initMasonry} className={wrapperStyles}>
      {dictionaries.map((dictionary) => (
        <div key={dictionary.id} className={itemStyles}>
          <DictionaryCard dictionary={dictionary} />
        </div>
      ))}
    </div>
  );
}

export default OnlyBrowser(observer(SettingsDictionariesView));
