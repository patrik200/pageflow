import React from "react";
import { Constructable, ContainerInstance } from "typedi";
import { usePrevious } from "@worksolutions/react-utils";
import { isDeepEqual, pick } from "@worksolutions/utils";
import { useRouter } from "next/router";

import { getCoreKitCustomStorageClasses } from "bootstrap/customVariableGetters";

import { NextPageSystemResult, ServerSidePropsContext } from "./types";

import { Storage, storagesMap } from "../storage";
import { ViewContext } from "../viewContext";
import { createScopedContainer } from "../next";
import {
  BeforeLoadResult,
  getServerSideProps,
  globalBrowserInitializer,
  PageDataLoaderResult,
} from "./serverSideProps";

export abstract class Page {
  protected constructor(
    private RootComponent: React.FC<{ __namespaces: Record<string, any> }>,
    private pageStorages: Constructable<Storage>[],
    private renderWrapper = true,
  ) {}

  // eslint-disable-next-line unused-imports/no-unused-vars
  beforeLoad(context: ServerSidePropsContext): BeforeLoadResult | Promise<BeforeLoadResult> {
    return null;
  }

  async initialize(
    // eslint-disable-next-line unused-imports/no-unused-vars
    context: ServerSidePropsContext,
    // eslint-disable-next-line unused-imports/no-unused-vars
    containerInstance: ContainerInstance,
  ): Promise<PageDataLoaderResult | NextPageSystemResult> {
    return [];
  }

  private runStorageInitializers(pageDataLoaderResult: PageDataLoaderResult, containerInstance: ContainerInstance) {
    pageDataLoaderResult.forEach(({ token, plainObject }) => {
      const storage = containerInstance.get<Storage>(storagesMap.get(token));
      storage.restore(plainObject, containerInstance);
    });
  }

  private frontendContainerInstance: ContainerInstance | null = null;

  private runIsomorphicStorageInitializers(pageDataLoaderResult: PageDataLoaderResult | undefined = []) {
    if (typeof window === "undefined") {
      const { container, dispose } = createScopedContainer();
      this.runStorageInitializers(pageDataLoaderResult, container);
      setTimeout(dispose, 60000);
      return container;
    }

    if (this.frontendContainerInstance) return this.frontendContainerInstance;
    const { container } = createScopedContainer();
    this.pageStorages.forEach((PageStorage) => container.get(PageStorage));
    getCoreKitCustomStorageClasses().forEach((PageStorage) => container.get(PageStorage));
    this.frontendContainerInstance = container;
    this.runStorageInitializers(pageDataLoaderResult, container);
    globalBrowserInitializer.forEach((callback) => callback(container));
    return container;
  }

  private clearFrontendContainerInstanceWhenJustQueryChanged() {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { pathname, query } = useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const previousPathname = usePrevious(pathname);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const previousQuery = usePrevious(query);

    if (pathname !== previousPathname) return;
    if (isDeepEqual(pick(getParamsFromPathname(pathname), query), pick(getParamsFromPathname(pathname), previousQuery)))
      return;

    this.frontendContainerInstance = null;
  }

  default = ({
    pageDataLoaderResult,
    Wrapper,
    additionalElement,
    __namespaces,
    __stopRendering,
  }: {
    pageDataLoaderResult: PageDataLoaderResult;
    Wrapper: React.FC<{ children: React.ReactNode }>;
    additionalElement?: React.ReactNode;
    __namespaces: Record<string, any>;
    __stopRendering: boolean;
  }) => {
    if (__stopRendering) return null;
    this.clearFrontendContainerInstanceWhenJustQueryChanged();

    const containerInstance = this.runIsomorphicStorageInitializers(pageDataLoaderResult);
    const { RootComponent } = this;

    if (typeof window !== "undefined") {
      React.useEffect(() => () => void (this.frontendContainerInstance = null), []);
    }

    return (
      <ViewContext.Provider value={{ containerInstance }}>
        {additionalElement}
        {this.renderWrapper && Wrapper ? (
          <Wrapper>
            <RootComponent __namespaces={__namespaces} />
          </Wrapper>
        ) : (
          <RootComponent __namespaces={__namespaces} />
        )}
      </ViewContext.Provider>
    );
  };

  getServerSideProps = (context: ServerSidePropsContext) =>
    getServerSideProps(context, this.initialize.bind(this), { beforeLoad: this.beforeLoad });
}

export {
  globalInternalPageDataLoader,
  globalAsyncPageDataLoader,
  globalExternalPageDataLoader,
  globalPageValidators,
  globalBrowserInitializer,
} from "./serverSideProps";

export type { BeforeLoadResult, PageDataLoaderResult } from "./serverSideProps";

export type { ServerSidePropsContext, NextPageSystemResult } from "./types";

function getParamsFromPathname(pathname: string) {
  return [...pathname.matchAll(/\[[a-zA-Z0-9_-]+\]/g)].map(([text]) => text.slice(1, -1));
}
