import React, { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { ProgressBar, Typography } from "@app/ui-kit";
import cn from "classnames";

import FormFieldUser from "components/FormField/User";

import { UserEntity } from "core/entities/user";

import Divider from "../Divider";
import UserFlowViewRow, { UserFlowViewRowEntityInterface } from "./Row";
import DeadlineDateTag from "./DeadlineDateTag";
import DeadlineDaysAmountText from "./DeadlineDaysAmountText";

import {
  nameStyles,
  progressBarStyles,
  progressBarWrapperStyles,
  reviewerActionsWrapperStyles,
  reviewerPlaceholderTextStyles,
  reviewerStyles,
  rowsWrapperStyles,
  topWrapperStyles,
  wrapperStyles,
} from "./style.css";

interface UserFlowViewInterface {
  className?: string;
  name: string;
  deadlineDaysIncludeWeekends: boolean;
  deadlineDaysAmount?: number | null;
  deadlineDate?: Date;
  approvedDate?: Date;
  reviewer: UserEntity | undefined;
  reviewerActions?: React.ReactNode;
  reviewerPlaceholder?: string;
  progress?: number;
  rows: UserFlowViewRowEntityInterface[];
}

function UserFlowView({
  className,
  name,
  deadlineDaysIncludeWeekends,
  deadlineDaysAmount,
  deadlineDate,
  approvedDate,
  progress,
  rows,
  reviewer,
  reviewerActions,
  reviewerPlaceholder,
}: UserFlowViewInterface) {
  return (
    <div className={cn(wrapperStyles, className)}>
      <div className={topWrapperStyles}>
        <div className={topWrapperStyles}>
          <Typography className={nameStyles}>{name}</Typography>
          <DeadlineDaysAmountText
            deadlineDaysAmount={deadlineDaysAmount}
            deadlineDaysIncludeWeekends={deadlineDaysIncludeWeekends}
          />
          <DeadlineDateTag
            deadlineDate={deadlineDate}
            approvedDate={approvedDate}
            deadlineDaysIncludeWeekends={deadlineDaysIncludeWeekends}
          />
        </div>
        {progress !== undefined && (
          <div className={progressBarWrapperStyles}>
            <ProgressBar className={progressBarStyles} value={progress} />
          </div>
        )}
      </div>
      <div className={rowsWrapperStyles}>
        {rows.map((row, key) => (
          <Fragment key={key}>
            <UserFlowViewRow entity={row} index={key} />
            {key !== rows.length - 1 && <Divider />}
          </Fragment>
        ))}
      </div>
      {reviewer && (
        <div className={reviewerStyles}>
          {reviewerPlaceholder && (
            <Typography className={reviewerPlaceholderTextStyles}>{reviewerPlaceholder}</Typography>
          )}
          <FormFieldUser value={reviewer} />
          {reviewerActions && <div className={reviewerActionsWrapperStyles}>{reviewerActions}</div>}
        </div>
      )}
    </div>
  );
}

export default observer(UserFlowView);

export type { UserFlowViewRowEntityInterface } from "./Row";
