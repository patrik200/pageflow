import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import UserRow from "components/UserRow";
import { Link } from "components/Link";

import { ProfileStorage } from "core/storages/profile/profile";

import Logout from "./Logout";

import { menuUserWrapperStyles, userLinkStyles } from "./style.css";

function MenuUser() {
  const { user } = useViewContext().containerInstance.get(ProfileStorage);
  return (
    <div className={menuUserWrapperStyles}>
      <Link className={userLinkStyles} href="/users/current">
        <UserRow dots user={user} />
      </Link>
      <Logout />
    </div>
  );
}

export default observer(MenuUser);
