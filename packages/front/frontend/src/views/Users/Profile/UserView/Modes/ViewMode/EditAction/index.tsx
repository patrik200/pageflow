import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";

import { UserDetailStorage } from "core/storages/user/userDetail";

interface EditUserActionInterface {
  enableEditMode: () => void;
}

function EditUserAction({ enableEditMode }: EditUserActionInterface) {
  const { t } = useTranslation("user-profile");
  const { user } = useViewContext().containerInstance.get(UserDetailStorage);

  if (!user!.canUpdate) return null;

  return <Button onClick={enableEditMode}>{t({ scope: "tab_user", place: "edit", name: "edit_action" })}</Button>;
}

export default observer(EditUserAction);
