import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";

import UserFlowList from "./List";
import UserFlowActions from "./Actions";
import PageWrapper from "../../_PageWrapper";

import { useUserFlowLoading } from "./hooks/useUserFlowLoading";

function UserFlowListView() {
  const { t } = useTranslation("user-flow");

  const { loading } = useUserFlowLoading();

  return (
    <PageWrapper loading={loading} title={t({ scope: "meta", name: "title" })}>
      <CardTitlePreset title={t({ scope: "meta", name: "title" })} actions={<UserFlowActions />} />
      <UserFlowList />
    </PageWrapper>
  );
}

export default observer(UserFlowListView);
