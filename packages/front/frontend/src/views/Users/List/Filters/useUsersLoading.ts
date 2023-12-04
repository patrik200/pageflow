import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import { UsersListFiltersEntity } from "core/storages/user/entities/Filter";

import { UsersListStorage } from "core/storages/user/usersList";

export function useUsersLoading(entity: UsersListFiltersEntity) {
  const { loadUsersList } = useViewContext().containerInstance.get(UsersListStorage);

  const [loaded, setLoaded] = React.useState(false);
  const [{ loading }, asyncLoadUsersList] = useAsyncFn(loadUsersList, [loadUsersList], { loading: true });

  React.useEffect(() => {
    asyncLoadUsersList(entity).finally(() => setLoaded(true));
    return entity.subscribeOnChange(() => asyncLoadUsersList(entity));
  }, [asyncLoadUsersList, entity]);

  return { loading, loaded };
}
