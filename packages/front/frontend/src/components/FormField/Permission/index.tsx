import React from "react";
import { observer } from "mobx-react-lite";

import EditPermission, { EditPermissionInterface } from "./Views/Edit";
import NewPermission, { NewPermissionInterface } from "./Views/New";
import ViewPermission, { ViewPermissionInterface } from "./Views/View";

type FormFieldPermissionInterface =
  | ({ edit: true } & EditPermissionInterface)
  | ({ edit: true } & NewPermissionInterface)
  | ({ view: true } & ViewPermissionInterface);

function FormFieldPermission(props: FormFieldPermissionInterface) {
  return (
    <>
      {"edit" in props && "permission" in props && <EditPermission {...props} />}
      {"edit" in props && !("permission" in props) && <NewPermission {...props} />}
      {"view" in props && <ViewPermission {...props} />}
    </>
  );
}

export default observer(FormFieldPermission);

export { useCurrentUserPermission } from "./Views/Edit";
