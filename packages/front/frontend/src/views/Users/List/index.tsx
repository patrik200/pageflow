import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import CardTablePreset from "components/Card/pressets/CardTable";

import { UsersListFiltersEntity } from "core/storages/user/entities/Filter";

import UsersListFilters from "./Filters";
import { useUsersLoading } from "./Filters/useUsersLoading";
import UsersTable from "./Table";
import CreateUserAction from "./Actions/Create";
import CreateInvitationAction from "./Actions/CreateInvitation";
import PageWrapper from "../../_PageWrapper";

function UsersListView() {
  const { t } = useTranslation("users-list");

  const entity = React.useMemo(() => UsersListFiltersEntity.buildEmpty(), []);

  const { loading, loaded } = useUsersLoading(entity);

  return (
    <PageWrapper loading={loaded ? false : loading} title={t({ scope: "meta", name: "title" })}>
      <CardTitlePreset
        title={t({ scope: "meta", name: "title" })}
        actions={
          <>
            <CreateUserAction />
            <CreateInvitationAction />
          </>
        }
      >
        <UsersListFilters entity={entity} loading={loading} />
      </CardTitlePreset>
      <CardTablePreset>
        <UsersTable filter={entity} />
      </CardTablePreset>
    </PageWrapper>
  );
}

export default observer(UsersListView);
