import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { AttributeCategory } from "@app/shared-enums";

import GroupedContent from "components/FormField/GroupedContent";
import FormFieldText from "components/FormField/Text";
import FormFieldCheckbox from "components/FormField/Checkbox";

import { EditCorrespondenceEntity } from "core/storages/correspondence/entities/correspondence/EditCorrespondence";

import FormFieldAttributes from "../../../../../../../components/FormField/Attributes";

interface MainViewInterface {
  loading: boolean;
  entity: EditCorrespondenceEntity;
}

function MainView({ loading, entity }: MainViewInterface) {
  const { t } = useTranslation("correspondence-detail");
  return (
    <GroupedContent>
      <FormFieldCheckbox
        edit
        disabled={loading}
        title={t({ scope: "main_tab", place: "private_field", name: "placeholder" })}
        placeholder={t({ scope: "main_tab", place: "private_field", name: "checkbox_placeholder" })}
        value={entity.isPrivate}
        onChange={entity.setIsPrivate}
      />
      <FormFieldText
        edit
        required
        disabled={loading}
        title={t({ scope: "main_tab", place: "name_field", name: "placeholder" })}
        value={entity.name}
        errorMessage={entity.viewErrors.name}
        onChange={entity.setName}
      />
      <FormFieldText
        edit
        disabled={loading}
        rows={5}
        title={t({ scope: "main_tab", place: "description_field", name: "placeholder" })}
        value={entity.description}
        errorMessage={entity.viewErrors.description}
        onChange={entity.setDescription}
      />
      <FormFieldAttributes
        edit
        category={AttributeCategory.CORRESPONDENCE}
        title={t({ scope: "main_tab", place: "attributes_field", name: "placeholder" })}
        value={entity.attributeValues}
        onCreate={entity.addAttributeValue}
        onDelete={entity.deleteAttributeValueByIndex}
      />
    </GroupedContent>
  );
}

export default observer(MainView);
