import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { SelectFieldOption } from "@app/ui-kit";
import { DateMode } from "@worksolutions/utils";

import FormFieldText from "components/FormField/Text";
import FormFieldUser from "components/FormField/User";
import FormFieldSelect from "components/FormField/Select";
import SimpleTextSelectFieldTrigger from "components/FormField/Select/SimpleTextSelectFieldTrigger";
import FormFieldDate from "components/FormField/Date";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldAttributes from "components/FormField/Attributes";

import { DocumentStorage } from "core/storages/document";
import { DictionariesCommonStorage } from "core/storages/dictionary/common";

function MainContent() {
  const { t } = useTranslation("document-detail");
  const { containerInstance } = useViewContext();
  const document = containerInstance.get(DocumentStorage).documentDetail!;
  const { documentTypeDictionary } = containerInstance.get(DictionariesCommonStorage);

  const typeSelectOptions = React.useMemo<SelectFieldOption<string>[]>(
    () => documentTypeDictionary.values.map(({ key, value }) => ({ value: key, label: value })),
    [documentTypeDictionary.values],
  );

  return (
    <GroupedContent>
      <FormFieldText
        view
        title={t({ scope: "main_tab", place: "description_field", name: "placeholder" })}
        value={document.description}
      />
      <FormFieldUser
        title={t({ scope: "main_tab", place: "author_field", name: "placeholder" })}
        value={document.author}
      />
      <FormFieldSelect
        view
        title={t({ scope: "main_tab", place: "type_field", name: "placeholder" })}
        value={document.type?.key ?? null}
        options={typeSelectOptions}
        TextViewTrigger={SimpleTextSelectFieldTrigger}
      />
      <FormFieldAttributes
        view
        title={t({ scope: "main_tab", place: "attributes_field", name: "placeholder" })}
        value={document.attributeValues}
      />
      <FormFieldDate
        view
        title={t({ scope: "main_tab", place: "created_at_field", name: "placeholder" })}
        value={document.createdAt}
        dateMode={DateMode.DATE_WITH_STRING_MONTH}
      />
      <FormFieldDate
        view
        title={t({ scope: "main_tab", place: "updated_at_field", name: "placeholder" })}
        value={document.updatedAt}
        dateMode={DateMode.DATE_WITH_STRING_MONTH}
      />
    </GroupedContent>
  );
}

export default observer(MainContent);
