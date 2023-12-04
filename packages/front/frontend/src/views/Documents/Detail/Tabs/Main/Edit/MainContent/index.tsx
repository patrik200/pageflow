import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { SelectFieldOption } from "@app/ui-kit";
import { AttributeCategory } from "@app/shared-enums";

import FormFieldText from "components/FormField/Text";
import FormFieldSelect from "components/FormField/Select";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldCheckbox from "components/FormField/Checkbox";
import FormFieldAttributes from "components/FormField/Attributes";

import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

interface MainContentInterface {
  loading: boolean;
  entity: EditDocumentEntity;
}

function MainContent({ loading, entity }: MainContentInterface) {
  const { t } = useTranslation("document-detail");
  const { documentTypeDictionary } = useViewContext().containerInstance.get(DictionariesCommonStorage);

  const typeSelectOptions = React.useMemo<SelectFieldOption<string | null>[]>(
    () => [
      { value: null, label: t({ scope: "common:common_form_fields", place: "select", name: "none_value" }) },
      ...documentTypeDictionary.values.map(({ key, value }) => ({ value: key, label: value })),
    ],
    [documentTypeDictionary.values, t],
  );

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
        disabled={loading}
        required
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
      <FormFieldSelect
        edit
        disabled={loading}
        searchable
        title={t({ scope: "main_tab", place: "type_field", name: "placeholder" })}
        value={entity.type}
        errorMessage={entity.viewErrors.type}
        options={typeSelectOptions}
        onChange={entity.setType}
      />
      <FormFieldAttributes
        edit
        category={AttributeCategory.DOCUMENT}
        title={t({ scope: "main_tab", place: "attributes_field", name: "placeholder" })}
        value={entity.attributeValues}
        onCreate={entity.addAttributeValue}
        onDelete={entity.deleteAttributeValueByIndex}
      />
    </GroupedContent>
  );
}

export default observer(MainContent);
