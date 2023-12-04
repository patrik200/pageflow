import React from "react";
import { observer } from "mobx-react-lite";
import {
  PopupManagerInterface,
  SelectableListValue,
  SelectFieldOption,
  SelectFieldTriggerInterface,
} from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import UnavailableUntilUserTooltip from "components/UnavailableUserTooltip";

import { UserEntity } from "core/entities/user";

import { AllUsersStorage } from "core/storages/profile/allUsers";

import { FormFieldWrapperDirection } from "../Wrapper";
import FormFieldSelect from "../Select";
import NameAndImageRowAvatar from "../../NameAndImageRow/Avatar";

import { inputFieldStyles } from "./style.css";

type FormFieldUserSelectInterface<
  HAS_NO_USER extends boolean,
  VALUE extends HAS_NO_USER extends true ? SelectableListValue : Exclude<SelectableListValue, null>,
> = {
  className?: string;
  CustomTrigger?: React.FC<SelectFieldTriggerInterface>;
  popupWidth?: PopupManagerInterface["popupWidth"];
  hasNoUser: HAS_NO_USER;
  direction?: FormFieldWrapperDirection;
  title?: string;
  value: VALUE;
  required?: boolean;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
  filterUsers?: (user: UserEntity) => boolean;
  onChange: (value: VALUE) => void;
};

function FormFieldUserSelect<
  HAS_NO_USER extends boolean,
  VALUE extends HAS_NO_USER extends true ? SelectableListValue : Exclude<SelectableListValue, null>,
>({ hasNoUser, value, filterUsers, onChange, ...props }: FormFieldUserSelectInterface<HAS_NO_USER, VALUE>) {
  const options = useAllUsersSelectFieldOptions<HAS_NO_USER, VALUE>(hasNoUser, filterUsers);
  return (
    <FormFieldSelect
      {...props}
      inputFieldWrapperClassName={inputFieldStyles}
      edit
      searchable
      value={value}
      options={options}
      onChange={onChange}
    />
  );
}

export default observer(FormFieldUserSelect);

export function useAllUsersSelectFieldOptions<
  HAS_NO_USER extends boolean,
  VALUE extends HAS_NO_USER extends true ? SelectableListValue : Exclude<SelectableListValue, null>,
>(hasNoUser: HAS_NO_USER, filterUsers?: (user: UserEntity) => boolean) {
  const { t } = useTranslation();
  const { allUsers } = useViewContext().containerInstance.get(AllUsersStorage);
  return useObservableAsDeferredMemo(
    (allUsers): SelectFieldOption<VALUE>[] => {
      const userOptions = (filterUsers ? allUsers.filter(filterUsers) : allUsers).map(
        (user) =>
          ({
            value: user.id,
            label: user.name,
            secondaryLabel: user.position,
            rightLayout: <UnavailableUntilUserTooltip userUnavailableUntil={user.unavailableUntil} />,
            leftLayout: <NameAndImageRowAvatar image={user.avatar} name={user.name} />,
          } as SelectFieldOption<VALUE>),
      );

      return [
        {
          value: null,
          label: t({ scope: "common:common_form_fields", place: "select", name: "none_value" }),
          hidden: !hasNoUser,
        } as SelectFieldOption<VALUE>,
        ...userOptions,
      ];
    },
    [filterUsers, hasNoUser, t],
    allUsers,
  );
}
