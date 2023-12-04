import React from "react";
import { observer } from "mobx-react-lite";
import {
  formatPhoneNumberWithLibPhoneNumber,
  Table,
  TableBody,
  TableCell,
  TableCellDefaultText,
  TableHead,
  TableHeadCell,
  TableHeadCellAvailableOrder,
  TableRow,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";
import { UserSortingFields } from "@app/shared-enums";

import UserRow from "components/UserRow";

import { UsersListFiltersEntity } from "core/storages/user/entities/Filter";

import { UsersListStorage } from "core/storages/user/usersList";

interface UsersTableInterface {
  filter: UsersListFiltersEntity;
}

function UsersTable({ filter }: UsersTableInterface) {
  const { t } = useTranslation("users-list");
  const { users } = useViewContext().containerInstance.get(UsersListStorage);

  const handleSortingFabric = useMemoizeCallback(
    (field: UserSortingFields) => (value: TableHeadCellAvailableOrder) => filter.setSorting(field, value),
    [filter],
    identity,
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell
            order={filter.getSortingForField(UserSortingFields.NAME)}
            onChangeOrder={handleSortingFabric(UserSortingFields.NAME)}
          >
            {t({ scope: "table", place: "header", name: "name" })}
          </TableHeadCell>
          <TableHeadCell
            order={filter.getSortingForField(UserSortingFields.POSITION)}
            onChangeOrder={handleSortingFabric(UserSortingFields.POSITION)}
          >
            {t({ scope: "table", place: "header", name: "position" })}
          </TableHeadCell>
          <TableHeadCell>{t({ scope: "table", place: "header", name: "email" })}</TableHeadCell>
          <TableHeadCell>{t({ scope: "table", place: "header", name: "phone" })}</TableHeadCell>
          <TableHeadCell>{t({ scope: "table", place: "header", name: "role" })}</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} href={`/users/${user.id}`}>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                <UserRow user={user} />
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {user.position}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {user.email}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                {user.phone && formatPhoneNumberWithLibPhoneNumber(user.phone)}
              </TableCellDefaultText>
            </TableCell>
            <TableCell>
              <TableCellDefaultText>{t({ scope: "common:user_roles", name: user.role })}</TableCellDefaultText>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default observer(UsersTable);
