import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { DateMode } from "@worksolutions/utils";

import GroupedContent from "components/FormField/GroupedContent";
import FormFieldText from "components/FormField/Text";
import FormFieldUser from "components/FormField/User";
import FormFieldDate from "components/FormField/Date";
import FormFieldAttributes from "components/FormField/Attributes";

import { CorrespondenceStorage } from "core/storages/correspondence";

function MainForm() {
  const { t } = useTranslation("correspondence-detail");
  const correspondence = useViewContext().containerInstance.get(CorrespondenceStorage).correspondenceDetail!;

  return (
    <GroupedContent>
      <FormFieldText
        view
        title={t({ scope: "main_tab", place: "description_field", name: "placeholder" })}
        value={correspondence.description}
      />
      <FormFieldUser
        title={t({ scope: "main_tab", place: "author_field", name: "placeholder" })}
        value={correspondence.author}
      />
      <FormFieldAttributes
        view
        title={t({ scope: "main_tab", place: "attributes_field", name: "placeholder" })}
        value={correspondence.attributeValues}
      />
      <FormFieldDate
        view
        title={t({ scope: "main_tab", place: "created_at_field", name: "placeholder" })}
        value={correspondence.createdAt}
        dateMode={DateMode.DATE_TIME_WITH_STRING_MONTH}
      />
      <FormFieldDate
        view
        title={t({ scope: "main_tab", place: "updated_at_field", name: "placeholder" })}
        value={correspondence.updatedAt}
        dateMode={DateMode.DATE_TIME_WITH_STRING_MONTH}
      />
    </GroupedContent>
  );
}

export default observer(MainForm);
