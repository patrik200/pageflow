import React from "react";
import { observer } from "mobx-react-lite";

import NameAndImageRow from "components/NameAndImageRow";

import { UserEntity } from "core/entities/user";

interface UserRowInterface {
  className?: string;
  dots?: boolean;
  user: UserEntity;
  hidePosition?: boolean;
}

function UserRow({ className, dots, user, hidePosition }: UserRowInterface) {
  return (
    <NameAndImageRow
      className={className}
      dots={dots}
      image={user.avatar}
      name={user.name}
      position={hidePosition ? undefined : user.position}
      unavailableUntil={user.unavailableUntil}
    />
  );
}

export default observer(UserRow);
