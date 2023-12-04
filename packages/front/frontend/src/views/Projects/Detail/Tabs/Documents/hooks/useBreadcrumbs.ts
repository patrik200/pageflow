import React from "react";
import { useTranslation, useViewContext } from "@app/front-kit";

import { BreadcrumbInterface } from "components/Breadcrumbs";

import { DocumentStorage } from "core/storages/document";

export function useDocumentBreadcrumbs() {
  const { groupsAndDocuments, filter } = useViewContext().containerInstance.get(DocumentStorage);

  const { t } = useTranslation("document");
  return React.useMemo<BreadcrumbInterface[]>(() => {
    const rootBreadcrumb: BreadcrumbInterface = {
      text: t({ scope: "breadcrumbs", name: "root_project" }),
      onClick: () => filter.setParentGroupId(null),
    };

    const breadcrumbs: BreadcrumbInterface[] = groupsAndDocuments.groupsPath.map((group) => ({
      text: group.name,
      onClick: () => filter.setParentGroupId(group.id),
    }));

    return [rootBreadcrumb, ...breadcrumbs];
  }, [t, groupsAndDocuments.groupsPath, filter]);
}
