import React from "react";
import { useViewContext } from "@app/front-kit";

import { FormFieldTextEmptyView } from "components/FormField/Text";
import UserRow from "components/UserRow";

import { AllUsersStorage } from "core/storages/profile/allUsers";

interface UserRendererInterface {
  value: string | null;
}

function UserRenderer({ value }: UserRendererInterface) {
  const { allUsers } = useViewContext().containerInstance.get(AllUsersStorage);
  const user = React.useMemo(() => {
    if (!value) return null;
    return allUsers.find((user) => user.id === value);
  }, [allUsers, value]);

  if (!user) return <FormFieldTextEmptyView />;
  return <UserRow user={user} />;
}

export default React.memo(UserRenderer);
