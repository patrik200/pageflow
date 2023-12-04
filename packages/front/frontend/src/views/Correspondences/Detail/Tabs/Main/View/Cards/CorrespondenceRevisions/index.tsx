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
  TableHeadCellAvailableOrder,
  TableRow,
  typographyOptionalStyleVariants,
} from "@app/ui-kit";
import { useAsyncFn, useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";
import { CorrespondenceRevisionSortingFields } from "@app/shared-enums";

import CardTablePreset from "components/Card/pressets/CardTable";
import UserRow from "components/UserRow";
import AdditionalActionFavourite from "components/AdditionalActionFavourite";
import ArchivedTag from "components/Card/pressets/CardTitle/ArchivedTag";
import ActionsTableCell from "components/ActionsTableCell";

import { CorrespondenceRevisionFilterEntity } from "core/storages/correspondence/entities/revision/CorrespondenceRevisionFilter";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";
import { CorrespondenceStorage } from "core/storages/correspondence";

import CorrespondenceRevisionsActions from "./Actions";

function CorrespondenceRevisionsCard() {
  const { t } = useTranslation("correspondence-detail");
  const { containerInstance } = useViewContext();
  const { revisions, loadRevisions, setFavourite } = containerInstance.get(CorrespondenceRevisionsStorage);
  const { correspondenceDetail } = containerInstance.get(CorrespondenceStorage);
  const [{ loading }, asyncLoadRevisions] = useAsyncFn(loadRevisions, [loadRevisions], { loading: true });

  const filter = React.useMemo(
    () => CorrespondenceRevisionFilterEntity.buildEmpty(correspondenceDetail!.id),
    [correspondenceDetail],
  );

  React.useEffect(() => {
    void asyncLoadRevisions(filter);
    return filter.subscribeOnChange(() => asyncLoadRevisions(filter));
  }, [asyncLoadRevisions, filter]);

  const handleFavouriteFabric = useMemoizeCallback(
    (revisionId: string) => (favourite: boolean) => setFavourite(revisionId, favourite),
    [setFavourite],
    identity,
  );

  const handleSortingFabric = useMemoizeCallback(
    (field: CorrespondenceRevisionSortingFields) => (value: TableHeadCellAvailableOrder) =>
      filter.setSorting(field, value),
    [filter],
    identity,
  );

  return (
    <CardTablePreset
      title={t({ scope: "main_tab_revisions", name: "title" })}
      actions={<CorrespondenceRevisionsActions filter={filter} />}
    >
      <Table loading={loading}>
        <TableHead>
          <TableRow>
            <TableHeadCell
              order={filter.getSortingForField(CorrespondenceRevisionSortingFields.NUMBER)}
              onChangeOrder={handleSortingFabric(CorrespondenceRevisionSortingFields.NUMBER)}
            >
              {t({ scope: "main_tab_revisions", place: "table", name: "header", parameter: "number" })}
            </TableHeadCell>
            <TableHeadCell
              order={filter.getSortingForField(CorrespondenceRevisionSortingFields.STATUS)}
              onChangeOrder={handleSortingFabric(CorrespondenceRevisionSortingFields.STATUS)}
            >
              {t({ scope: "main_tab_revisions", place: "table", name: "header", parameter: "status" })}
            </TableHeadCell>
            <TableHeadCell
              order={filter.getSortingForField(CorrespondenceRevisionSortingFields.CREATED_AT)}
              onChangeOrder={handleSortingFabric(CorrespondenceRevisionSortingFields.CREATED_AT)}
            >
              {t({ scope: "main_tab_revisions", place: "table", name: "header", parameter: "created_at" })}
            </TableHeadCell>
            <TableHeadCell
              order={filter.getSortingForField(CorrespondenceRevisionSortingFields.AUTHOR)}
              onChangeOrder={handleSortingFabric(CorrespondenceRevisionSortingFields.AUTHOR)}
            >
              {t({ scope: "main_tab_revisions", place: "table", name: "header", parameter: "author" })}
            </TableHeadCell>
            <TableHeadCell>{null}</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {revisions.map((revision) => (
            <TableRow key={revision.id} href={`/correspondence-revisions/${revision.id}`}>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {revision.number}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {t({ scope: "common:correspondence_revision_statuses", name: revision.status })}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  {revision.viewCreatedAt}
                </TableCellDefaultText>
              </TableCell>
              <TableCell>
                <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
                  <UserRow user={revision.author} />
                </TableCellDefaultText>
              </TableCell>
              <ActionsTableCell size="122">
                {revision.archived && <ArchivedTag />}
                <AdditionalActionFavourite
                  favourite={revision.favourite}
                  onChange={handleFavouriteFabric(revision.id)}
                />
              </ActionsTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardTablePreset>
  );
}

export default observer(CorrespondenceRevisionsCard);
