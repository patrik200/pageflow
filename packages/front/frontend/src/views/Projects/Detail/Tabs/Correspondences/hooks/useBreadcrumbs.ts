import React from "react";
import { useTranslation, useViewContext } from "@app/front-kit";

import { BreadcrumbInterface } from "components/Breadcrumbs";

import { CorrespondenceStorage } from "core/storages/correspondence";

export function useCorrespondenceBreadcrumbs() {
  const { t } = useTranslation("correspondence");
  const { groupsAndCorrespondences, filter } = useViewContext().containerInstance.get(CorrespondenceStorage);

  return React.useMemo<BreadcrumbInterface[]>(() => {
    const rootBreadcrumb: BreadcrumbInterface = {
      text: t({ scope: "breadcrumbs", name: "root_project" }),
      onClick: () => filter.setParentGroupId(null),
    };

    const breadcrumbs: BreadcrumbInterface[] = groupsAndCorrespondences.groupsPath.map((group) => ({
      text: group.name,
      onClick: () => filter.setParentGroupId(group.id),
    }));

    return [rootBreadcrumb, ...breadcrumbs];
  }, [t, groupsAndCorrespondences.groupsPath, filter]);
}
