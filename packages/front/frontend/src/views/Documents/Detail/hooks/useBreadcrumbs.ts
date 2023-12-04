import React from "react";
import { RouterPatchedPush, useRouter, useTranslation, useViewContext } from "@app/front-kit";

import { BreadcrumbInterface } from "components/Breadcrumbs";

import { DocumentStorage } from "core/storages/document";

export function useBreadcrumbs() {
  const { t } = useTranslation("document");
  const { documentDetail } = useViewContext().containerInstance.get(DocumentStorage);
  const { push } = useRouter();

  return React.useMemo<BreadcrumbInterface[]>(() => {
    if (!documentDetail) return [];
    const documentRootGroup = documentDetail.rootGroup!;
    const breadcrumbs: BreadcrumbInterface[] = [];

    switch (true) {
      case !!documentRootGroup.project:
        {
          const { project } = documentRootGroup;

          breadcrumbs.push(createBreadcrumb(push, t({ scope: "breadcrumbs", name: "root_project" }), "/projects"));
          breadcrumbs.push(createBreadcrumb(push, project!.name, "/projects/[id]", { id: project!.id }));
          documentDetail.parentGroup?.groupsPath.forEach((group) =>
            breadcrumbs.push(
              createBreadcrumb(push, group.name, "/projects/[id]", {
                id: project!.id,
                tab: "documents",
                dPath: group.id,
              }),
            ),
          );
        }
        break;
      default:
    }

    return breadcrumbs;
  }, [documentDetail, push, t]);
}

function createBreadcrumb(
  push: RouterPatchedPush,
  name: string,
  pathname: string,
  query?: Record<string, any>,
): BreadcrumbInterface {
  return {
    text: name,
    onClick: () => push.current({ pathname, query }),
  };
}
