import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { DateMode } from "@worksolutions/utils";

import Divider from "components/Divider";
import FormFieldText from "components/FormField/Text";
import FormFieldPhone from "components/FormField/Phone";
import FormFieldEmail from "components/FormField/Email";
import GroupedContent from "components/FormField/GroupedContent";
import FormFieldDate from "components/FormField/Date";

import { UserEntity } from "core/entities/user";

import DeleteUserAction from "./DeleteAction";
import EditUserAction from "./EditAction";
import RestoreUserAction from "./RestoreAction";
import ChangePasswordAction from "./ChangePassword";

import { actionsWrapperStyles } from "./style.css";

interface UserViewModeViewInterface {
  user: UserEntity;
  enableEditMode: () => void;
}

function UserViewModeView({ user, enableEditMode }: UserViewModeViewInterface) {
  const { t } = useTranslation("user-profile");

  return (
    <>
      <GroupedContent title={t({ scope: "tab_user", place: "common_block", name: "title" })}>
        <FormFieldText
          view
          direction="column"
          title={t({ scope: "tab_user", place: "common_block", name: "name_field", parameter: "placeholder" })}
          value={user.name}
        />
        <FormFieldText
          view
          direction="column"
          title={t({ scope: "tab_user", place: "common_block", name: "position_field", parameter: "placeholder" })}
          value={user.position}
        />
        <FormFieldText
          view
          direction="column"
          title={t({ scope: "tab_user", place: "common_block", name: "role_field", parameter: "placeholder" })}
          value={t({ scope: "common:user_roles", name: user.role })}
        />
        {user.unavailableUntil && (
          <FormFieldDate
            view
            direction="column"
            value={user.unavailableUntil}
            dateMode={DateMode.DATE_WITH_STRING_MONTH}
            title={t({
              scope: "tab_user",
              place: "common_block",
              name: "unavailable_until_field",
              parameter: "placeholder",
            })}
          />
        )}
      </GroupedContent>
      <Divider />
      <GroupedContent title={t({ scope: "tab_user", place: "contact_block", name: "title" })}>
        <FormFieldEmail
          view
          direction="column"
          value={user.email}
          title={t({ scope: "tab_user", place: "contact_block", name: "email_field", parameter: "placeholder" })}
        />
        <FormFieldPhone
          view
          direction="column"
          value={user.phone}
          title={t({ scope: "tab_user", place: "contact_block", name: "phone_field", parameter: "placeholder" })}
        />
      </GroupedContent>
      <Divider />
      <div className={actionsWrapperStyles}>
        <EditUserAction enableEditMode={enableEditMode} />
        <ChangePasswordAction />
        <DeleteUserAction />
        <RestoreUserAction />
      </div>
    </>
  );
}

export default observer(UserViewModeView);
