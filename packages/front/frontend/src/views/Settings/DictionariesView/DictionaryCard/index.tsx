import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { Button, SingleColumnDraggableList } from "@app/ui-kit";
import { useBoolean, useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import CardTitlePreset from "components/Card/pressets/CardTitle";

import { DictionaryEntity } from "core/entities/dictionary/dictionary";

import DictionaryValueRow, { DictionaryValueRowInterface } from "./ValueRow";
import UpdateDictionaryValueModal from "./UpdateValueModal";

import { useReorder } from "./hooks";

interface DictionaryCardInterface {
  dictionary: DictionaryEntity;
}

function DictionaryCard({ dictionary }: DictionaryCardInterface) {
  const { t } = useTranslation("settings");
  const list = useObservableAsDeferredMemo(
    (values): DictionaryValueRowInterface[] => values.map((value) => ({ value, valueKey: value.key, dictionary })),
    [dictionary],
    dictionary.values,
  );

  const [createValueOpened, openCreateValue, closeCreateValue] = useBoolean(false);

  const [reorderLoading, handleReorder] = useReorder(dictionary);

  return (
    <CardTitlePreset title={t({ scope: "common:dictionary_types", name: dictionary.type })} size="small">
      <SingleColumnDraggableList
        list={list}
        loading={reorderLoading}
        Component={DictionaryValueRow}
        itemKey="valueKey"
        onNewOrder={handleReorder}
      />
      <Button onClick={openCreateValue}>{t({ scope: "tab_dictionaries", name: "add_value_action" })}</Button>
      <UpdateDictionaryValueModal opened={createValueOpened} dictionary={dictionary} close={closeCreateValue} />
    </CardTitlePreset>
  );
}

export default observer(DictionaryCard);
