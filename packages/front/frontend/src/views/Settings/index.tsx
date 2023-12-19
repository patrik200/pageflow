import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import React from "react";
import { TabItemInterface } from "@app/ui-kit";
import dynamic from "next/dynamic";

import CardTitleTabsPreset from "components/Card/pressets/CardTitleTabs";

import ClientView from "./ClientView";
import SettingsPaymentsView from "./Payments";
import PageWrapper from "../_PageWrapper";

import { useTabs } from "internal/hooks/useTags";

const DictionariesView = dynamic(() => import("./DictionariesView"), { ssr: false });

type Tabs = "client" | "dictionaries" | "payments";

function SettingsView() {
  const { t } = useTranslation("settings");

  const { tab, setTab } = useTabs<Tabs>("client");

  const tabs = React.useMemo<TabItemInterface<Tabs>[]>(
    () => [
      { code: "client", title: t({ scope: "tab_client", name: "title" }) },
      { code: "dictionaries", title: t({ scope: "tab_dictionaries", name: "title" }) },
      { code: "payments", title: t({ scope: "tab_payments", name: "title" }) },
    ],
    [t],
  );

  return (
    <PageWrapper title={t({ scope: "meta", name: "title" })}>
      <CardTitleTabsPreset title={t({ scope: "meta", name: "title" })} items={tabs} active={tab} onChange={setTab} />
      {tab === "client" && <ClientView />}
      {tab === "dictionaries" && <DictionariesView />}
      {tab === "payments" && <SettingsPaymentsView />}
    </PageWrapper>
  );
}

export default observer(SettingsView);
