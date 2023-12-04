import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { ProgressBar, Typography } from "@app/ui-kit";
import { UserFlowMode } from "@app/shared-enums";
import { nbspString } from "@worksolutions/utils";
import cn from "classnames";

import UserFlowViewRowSeparator from "./Separator";
import UserFlowViewRowUser, { UserFlowViewRowUserEntityInterface } from "./User";

import {
  nameStyles,
  progressBarStyles,
  progressBarWrapperStyles,
  topWrapperStyles,
  usersWrapperStyles,
  wrapperCompletedStyles,
  wrapperStyles,
} from "./style.css";

export interface UserFlowViewRowEntityInterface {
  completed?: boolean;
  progress?: number;
  name: string;
  mode: UserFlowMode;
  users: UserFlowViewRowUserEntityInterface[];
}

interface UserFlowViewRowInterface {
  index: number;
  entity: UserFlowViewRowEntityInterface;
}

function UserFlowViewRow({ index, entity }: UserFlowViewRowInterface) {
  return (
    <div className={cn(wrapperStyles, entity.completed && wrapperCompletedStyles)}>
      <div className={topWrapperStyles}>
        <div className={topWrapperStyles}>
          <Typography className={nameStyles}>
            {index + 1}.{nbspString}
            {entity.name}
          </Typography>
        </div>
        {entity.progress !== undefined && (
          <div className={progressBarWrapperStyles}>
            <ProgressBar className={progressBarStyles} value={entity.progress} />
          </div>
        )}
      </div>
      <div className={usersWrapperStyles}>
        {entity.users.map((user, key) => (
          <Fragment key={key}>
            <UserFlowViewRowUser entity={user} />
            {key !== entity.users.length - 1 && <UserFlowViewRowSeparator mode={entity.mode} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default observer(UserFlowViewRow);
