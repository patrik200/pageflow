import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";

import PageWrapper from "../../_PageWrapper";
import UserCreateViewContent from "./Content";

function CreateUserView() {
  const { t } = useTranslation("user-profile");

  return (
    <PageWrapper title={t({ scope: "meta", name: "create" })}>
      <CardTitlePreset title={t({ scope: "meta", name: "create" })}>
        <UserCreateViewContent />
      </CardTitlePreset>
    </PageWrapper>
  );
}

export default observer(CreateUserView);
