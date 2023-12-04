import React from "react";
import { SelectFieldOption } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import NameAndImageRowAvatar from "components/NameAndImageRow/Avatar";

import { AllUsersStorage } from "core/storages/profile/allUsers";

export function useUserSelectOptions() {
  const { t } = useTranslation();
  const { allUsers } = useViewContext().containerInstance.get(AllUsersStorage);

  return useObservableAsDeferredMemo(
    (allUsers): SelectFieldOption<string | null>[] => [
      {
        label: t({ scope: "common_form_fields", place: "text", name: "empty_value" }),
        value: null,
      },
      ...allUsers.map((user) => ({
        value: user.id,
        label: user.name,
        secondaryLabel: user.position,
        leftLayout: <NameAndImageRowAvatar image={user.avatar} name={user.name} />,
      })),
    ],
    [t],
    allUsers,
  );
}
