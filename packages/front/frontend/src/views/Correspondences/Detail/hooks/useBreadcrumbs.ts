import React from "react";
import { RouterPatchedPush, useRouter, useTranslation, useViewContext } from "@app/front-kit";

import { BreadcrumbInterface } from "components/Breadcrumbs";

import { CorrespondenceStorage } from "core/storages/correspondence";

export function useCorrespondenceBreadcrumbs() {
  const { t } = useTranslation("correspondence");
  const { correspondenceDetail } = useViewContext().containerInstance.get(CorrespondenceStorage);
  const { push } = useRouter();

  return React.useMemo<BreadcrumbInterface[]>(() => {
    if (!correspondenceDetail) return [];
    const correspondenceRootGroup = correspondenceDetail.rootGroup!;
    const breadcrumbs: BreadcrumbInterface[] = [];

    switch (true) {
      case !!correspondenceRootGroup.project:
        {
          const { project } = correspondenceRootGroup;

          breadcrumbs.push(createBreadcrumb(push, t({ scope: "breadcrumbs", name: "root_project" }), "/projects"));
          breadcrumbs.push(createBreadcrumb(push, project!.name, "/projects/[id]", { id: project!.id }));
          correspondenceDetail.parentGroup?.groupsPath.forEach((group) =>
            breadcrumbs.push(
              createBreadcrumb(push, group.name, "/projects/[id]", {
                id: project!.id,
                tab: "correspondence",
                cPath: group.id,
              }),
            ),
          );
        }
        break;
      default:
        breadcrumbs.push(
          createBreadcrumb(push, t({ scope: "breadcrumbs", name: "root_correspondence" }), "/correspondences"),
        );
        correspondenceDetail.parentGroup?.groupsPath.forEach((group) =>
          breadcrumbs.push(createBreadcrumb(push, group.name, "/correspondences", { path: group.id })),
        );
    }

    return breadcrumbs;
  }, [correspondenceDetail, push, t]);
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
