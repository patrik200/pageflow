import React from "react";
import { observer } from "mobx-react-lite";
import { DraggableListComponentInterface, Icon, Typography } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";
import { useTranslation } from "@app/front-kit";

import AdditionalActions, { AdditionalActionButton } from "components/AdditionalActions";

import { DictionaryEntity, DictionaryValueEntity } from "core/entities/dictionary/dictionary";

import UpdateDictionaryValueModal from "../UpdateValueModal";
import DeleteDictionaryValueModal from "../DeleteValueModal";

import { keyTextStyles, valueTextStyles, wrapperStyles } from "./style.css";

export interface DictionaryValueRowInterface {
  dictionary: DictionaryEntity;
  value: DictionaryValueEntity;
  valueKey: string;
}

function DictionaryValueRow({
  value: { value, dictionary },
  dragProvider,
}: DraggableListComponentInterface<DictionaryValueRowInterface>) {
  const { t } = useTranslation("settings");
  const [editOpened, openEdit, closeEdit] = useBoolean(false);
  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);

  return (
    <div ref={dragProvider.innerRef} className={wrapperStyles} {...dragProvider.draggableProps}>
      <div {...dragProvider.dragHandleProps}>
        <Icon icon="draggable" />
      </div>
      <Typography className={keyTextStyles}>{value.key}</Typography>
      <Typography className={valueTextStyles}>{value.value}</Typography>
      <AdditionalActions closeOnClickOutside={!editOpened && !deleteOpened}>
        <AdditionalActionButton
          text={t({ scope: "tab_dictionaries", place: "value_row", name: "actions", parameter: "edit" })}
          onClick={openEdit}
        />
        {value.canDelete && (
          <AdditionalActionButton
            text={t({ scope: "tab_dictionaries", place: "value_row", name: "actions", parameter: "delete" })}
            onClick={openDelete}
          />
        )}
      </AdditionalActions>
      <UpdateDictionaryValueModal opened={editOpened} dictionary={dictionary} value={value} close={closeEdit} />
      <DeleteDictionaryValueModal opened={deleteOpened} dictionary={dictionary} value={value} close={closeDelete} />
    </div>
  );
}

export default observer(DictionaryValueRow);
