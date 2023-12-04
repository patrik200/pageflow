import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import React from "react";
import { TabItemInterface } from "@app/ui-kit";

import CardTitleTabsPreset from "components/Card/pressets/CardTitleTabs";
import CardLoadingPreset from "components/Card/pressets/CardLoading";

import PageWrapper from "../../_PageWrapper";
import UserView from "./UserView";

import { useTabs } from "internal/hooks/useTags";

import { useLoadUser } from "./hooks/useLoad";

type Tabs = "user" | "user_flow";

function ProfileView() {
  const { t } = useTranslation("user-profile");

  const { tab, setTab } = useTabs<Tabs>("user");

  const tabs = React.useMemo<TabItemInterface<Tabs>[]>(
    () => [
      { code: "user", title: t({ scope: "tab_user", name: "title" }) },
      // { code: "user_flow", title: t({ scope: "tab_user_flow", name: "title" }) },
    ],
    [t],
  );

  const user = useLoadUser();

  return (
    <PageWrapper title={t({ scope: "meta", name: user ? "title_name" : "title" }, { name: user?.name })}>
      {user ? (
        <>
          <CardTitleTabsPreset
            title={t({ scope: "meta", name: "title_name" }, { name: user.name })}
            items={tabs}
            active={tab}
            onChange={setTab}
          />
          {tab === "user" && <UserView user={user} />}
        </>
      ) : (
        <CardLoadingPreset title={t({ scope: "meta", name: "title" })} />
      )}
    </PageWrapper>
  );
}

export default observer(ProfileView);
