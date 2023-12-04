import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import GroupedContent from "components/FormField/GroupedContent";

import DocumentResponsibleUserFlow from "./ResponsibleUserFlow";
import DocumentResponsibleUser from "./ResponsibleUser";

function ResponsibleContent() {
  const { t } = useTranslation("document-detail");
  return (
    <>
      <GroupedContent title={t({ scope: "main_tab", place: "responsible_user_card", name: "title" })}>
        <DocumentResponsibleUser />
      </GroupedContent>
      <GroupedContent title={t({ scope: "main_tab", place: "responsible_user_flow_card", name: "title" })}>
        <DocumentResponsibleUserFlow />
      </GroupedContent>
    </>
  );
}

export default observer(ResponsibleContent);
