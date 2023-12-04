import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import CardTablePreset from "components/Card/pressets/CardTable";

import { CorrespondenceStorage } from "core/storages/correspondence";

import { useCorrespondencesLoading } from "../ListCommon/Filters/useCorrespondencesLoading";
import CorrespondencesFilters from "../ListCommon/Filters";
import CorrespondencesTable from "../ListCommon/Table";
import CorrespondenceActions from "../ListCommon/Actions";
import PageWrapper from "../../_PageWrapper";

import { useCorrespondenceRouter } from "./hooks/useRouter";
import { useCorrespondenceBreadcrumbs } from "./hooks/useBreadcrumbs";

function CorrespondencesListView() {
  const { t } = useTranslation("correspondence-list");

  const correspondenceStorage = useViewContext().containerInstance.get(CorrespondenceStorage);
  React.useMemo(() => correspondenceStorage.initEmptyFilter(), [correspondenceStorage]);
  React.useMemo(() => correspondenceStorage.initList(), [correspondenceStorage]);

  const { loading, loaded } = useCorrespondencesLoading(correspondenceStorage.filter);

  useCorrespondenceRouter(correspondenceStorage.filter);

  const breadcrumbs = useCorrespondenceBreadcrumbs();

  return (
    <PageWrapper loading={loaded ? false : loading} title={t({ scope: "meta", name: "title" })}>
      <CardTitlePreset title={t({ scope: "meta", name: "title" })}>
        <CorrespondencesFilters loading={loading} filter={correspondenceStorage.filter} />
      </CardTitlePreset>
      <CardTablePreset breadcrumbs={breadcrumbs} actions={<CorrespondenceActions />}>
        <CorrespondencesTable />
      </CardTablePreset>
    </PageWrapper>
  );
}

export default observer(CorrespondencesListView);
