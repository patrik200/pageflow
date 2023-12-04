import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";

import Card from "components/Card";

import { UserEntity } from "core/entities/user";

import UserViewModeView from "./Modes/ViewMode";
import UserViewModeEdit from "./Modes/EditMode";
import AvatarView from "./AvatarView";

import { cardStyles, contentWrapperStyles } from "./style.css";

interface UserViewInterface {
  user: UserEntity;
}

function UserView({ user }: UserViewInterface) {
  const [editMode, enableEditMode, disableEditMode] = useBoolean(false);

  return (
    <Card className={cardStyles}>
      <div className={contentWrapperStyles}>
        {editMode ? (
          <UserViewModeEdit user={user} disableEditMode={disableEditMode} />
        ) : (
          <UserViewModeView user={user} enableEditMode={enableEditMode} />
        )}
      </div>
      {!editMode && <AvatarView user={user} />}
    </Card>
  );
}

export default observer(UserView);
