import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import UserRow from "components/UserRow";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldText from "components/FormField/Text";
import FromFieldAttachments from "components/FormField/Attachments";

import { UserEntity } from "core/entities/user";
import { FileEntity } from "core/entities/file";

import { actionsWrapperStyles, deadlineStyles, resultStyles, rowStyles, wrapperStyles } from "./style.css";

export interface UserFlowViewRowUserEntityInterface {
  user: UserEntity;
  description?: string;
  actions?: React.ReactNode;
  result?: string;
  approved?: boolean;
  files?: FileEntity[];
}

interface UserFlowViewRowUserInterface {
  entity: UserFlowViewRowUserEntityInterface;
}

function UserFlowViewRowUser({ entity }: UserFlowViewRowUserInterface) {
  const { t } = useTranslation("user-flow");

  const hasResult = !!entity.result;
  const hasFiles = entity.files && entity.files.length !== 0;

  return (
    <div className={wrapperStyles}>
      <div className={rowStyles}>
        <UserRow user={entity.user} />
        {entity.actions && <div className={actionsWrapperStyles}>{entity.actions}</div>}
      </div>
      {entity.description !== undefined && <Typography className={deadlineStyles}>{entity.description}</Typography>}
      {entity.approved && (hasResult || hasFiles) && (
        <div className={resultStyles}>
          <GroupedContent>
            {hasResult && (
              <FormFieldText view title={t({ scope: "user_flow_card", name: "result_field" })} value={entity.result!} />
            )}
            {hasFiles && (
              <FromFieldAttachments
                view
                title={t({ scope: "user_flow_card", name: "attachments_field" })}
                value={entity.files!}
              />
            )}
          </GroupedContent>
        </div>
      )}
    </div>
  );
}

export default observer(UserFlowViewRowUser);
