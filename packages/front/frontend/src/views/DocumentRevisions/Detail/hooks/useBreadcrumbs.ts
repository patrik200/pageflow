import React from "react";
import { RouterPatchedPush, useRouter, useTranslation, useViewContext } from "@app/front-kit";

import { BreadcrumbInterface } from "components/Breadcrumbs";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

export function useBreadcrumbs() {
  const { t } = useTranslation("document");
  const { revisionDetail } = useViewContext().containerInstance.get(DocumentRevisionsStorage);
  const { push } = useRouter();

  return React.useMemo<BreadcrumbInterface[]>(() => {
    if (!revisionDetail) return [];
    const { document } = revisionDetail;
    const documentRootGroup = document.rootGroup!;

    const breadcrumbs: BreadcrumbInterface[] = [];

    switch (true) {
      case !!documentRootGroup.project:
        {
          const { project } = documentRootGroup;

          breadcrumbs.push(createBreadcrumb(push, t({ scope: "breadcrumbs", name: "root_project" }), "/projects"));
          breadcrumbs.push(createBreadcrumb(push, project!.name, "/projects/[id]", { id: project!.id }));
          document.parentGroup?.groupsPath.forEach((group) =>
            breadcrumbs.push(
              createBreadcrumb(push, group.name, "/projects/[id]", {
                id: project!.id,
                tab: "documents",
                dPath: group.id,
              }),
            ),
          );
          breadcrumbs.push(createBreadcrumb(push, document.name, "/documents/[id]", { id: document.id }));
        }
        break;
      default:
    }

    return breadcrumbs;
  }, [push, revisionDetail, t]);
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
