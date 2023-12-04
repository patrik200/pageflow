import React from "react";
import { useRouter, useTranslation, useViewContext, RouterPatchedPush } from "@app/front-kit";

import { BreadcrumbInterface } from "components/Breadcrumbs";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

export function useBreadcrumbs() {
  const { t } = useTranslation("correspondence");
  const { revisionDetail } = useViewContext().containerInstance.get(CorrespondenceRevisionsStorage);
  const { push } = useRouter();

  return React.useMemo<BreadcrumbInterface[]>(() => {
    if (!revisionDetail) return [];
    const correspondenceRootGroup = revisionDetail.correspondence.rootGroup!;
    const breadcrumbs: BreadcrumbInterface[] = [];
    const { correspondence } = revisionDetail;

    switch (true) {
      case !!correspondenceRootGroup.project:
        {
          const { project } = correspondenceRootGroup;

          breadcrumbs.push(createBreadcrumb(push, t({ scope: "breadcrumbs", name: "root_project" }), "/projects"));
          breadcrumbs.push(createBreadcrumb(push, project!.name, "/projects/[id]", { id: project!.id }));
          correspondence.parentGroup?.groupsPath.forEach((group) =>
            breadcrumbs.push(
              createBreadcrumb(push, group.name, "/projects/[id]", {
                id: project!.id,
                tab: "correspondence",
                cPath: group.id,
              }),
            ),
          );
          breadcrumbs.push(createBreadcrumb(push, project!.name, "/correspondences/[id]", { id: correspondence.id }));
        }
        break;
      default:
        breadcrumbs.push(
          createBreadcrumb(push, t({ scope: "breadcrumbs", name: "root_correspondence" }), "/correspondences"),
        );
        correspondence.parentGroup?.groupsPath.forEach((group) =>
          breadcrumbs.push(createBreadcrumb(push, group.name, "/correspondences", { path: group.id })),
        );
        breadcrumbs.push(
          createBreadcrumb(push, correspondence.name, "/correspondences/[id]", { id: correspondence.id }),
        );
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
