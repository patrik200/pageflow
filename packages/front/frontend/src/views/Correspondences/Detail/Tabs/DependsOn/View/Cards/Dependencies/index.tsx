import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import {
  Table,
  TableBody,
  TableCell,
  TableCellDefaultText,
  TableHead,
  TableHeadCell,
  TableRow,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import ActionsTableCell from "components/ActionsTableCell";
import CardTablePreset from "components/Card/pressets/CardTable";
import UserRow from "components/UserRow";

import { CorrespondenceStorage } from "core/storages/correspondence";
import { CorrespondenceDependenciesStorage } from "core/storages/correspondence/dependencies";

import CreateDependencyOnDocument from "./Actions/CreateDependencyOnDocument";
import RemoveDependencyOnDocument from "./Actions/RemoveDependencyOnDocument";

function CorrespondenceDependenciesTable() {
  const { t } = useTranslation("correspondence-dependencies");

  const { containerInstance } = useViewContext();
  const { correspondenceDetail } = containerInstance.get(CorrespondenceStorage);
  const { dependsOn, loadDependsOn } = containerInstance.get(CorrespondenceDependenciesStorage);

  const [{ loading }, asyncLoadDependsOn] = useAsyncFn(loadDependsOn, [loadDependsOn], { loading: true });

  React.useEffect(() => void asyncLoadDependsOn(correspondenceDetail!.id), [asyncLoadDependsOn, correspondenceDetail]);

  return (
    <CardTablePreset title={t({ scope: "depends_on_tab", name: "title" })} actions={<CreateDependencyOnDocument />}>
      <Table loading={loading}>
        <TableHead>
          <TableRow>
            <TableHeadCell>
              {t({ scope: "depends_to_tab", place: "table", name: "header", parameter: "number" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "depends_to_tab", place: "table", name: "header", parameter: "author" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "depends_to_tab", place: "table", name: "header", parameter: "created_at" })}
            </TableHeadCell>
            <TableHeadCell>
              {t({ scope: "depends_to_tab", place: "table", name: "header", parameter: "updated_at" })}
            </TableHeadCell>
            <TableHeadCell>{null}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dependsOn.map((document) => (
            <TableRow key={document.id} href={`/documents/${document.id}`}>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {document.name}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  <UserRow user={document.author} />
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {document.viewCreatedAt}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {document.viewUpdatedAt}
                </TableCellDefaultText>
              </TableCell>
              <ActionsTableCell size="160">
                <RemoveDependencyOnDocument documentId={document.id} />
              </ActionsTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardTablePreset>
  );
}

export default observer(CorrespondenceDependenciesTable);
