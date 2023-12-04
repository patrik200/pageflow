import React from "react";
import { useAsyncFn, useBoolean, useInfinityScroll } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import { ProjectsListFiltersEntity } from "core/storages/project/entities/Filter";

import { ProjectStorage } from "core/storages/project";

export function useProjectsLoading(entity: ProjectsListFiltersEntity) {
  const { projects, loadProjects } = useViewContext().containerInstance.get(ProjectStorage);

  const [{ loading }, asyncLoadProjects] = useAsyncFn(loadProjects, [loadProjects], { loading: true });

  const [, setPage] = React.useState(1);
  const [loaded, enableLoaded] = useBoolean(false);

  const handleLoadProjects = React.useCallback(
    async (page?: number) => {
      if (page === undefined) {
        setPage((page) => {
          const nextPage = page + 1;
          asyncLoadProjects(nextPage, entity);
          return nextPage;
        });
        return;
      }
      setPage(page);
      await asyncLoadProjects(page, entity);
    },
    [asyncLoadProjects, entity],
  );

  React.useEffect(() => {
    handleLoadProjects(1).then(enableLoaded);
    return entity.subscribeOnChange(() => handleLoadProjects(1));
  }, [enableLoaded, entity, handleLoadProjects]);

  const handleInitInfinityScroll = useInfinityScroll({
    loading,
    hasNextPage: projects.pagination.canGetMore,
    onLoadMore: handleLoadProjects,
  });

  React.useEffect(() => handleInitInfinityScroll(window), [handleInitInfinityScroll]);

  return { loading, loaded };
}
