import { ContainerInstance } from "typedi";
import { isArray, uniqBy } from "@worksolutions/utils";

import { NextPageSystemResult, ServerSidePropsContext } from "../types";

import { createScopedContainer } from "../../next";
import {
  BeforeLoadResult,
  globalAsyncPageDataLoader,
  globalExternalPageDataLoader,
  globalInternalPageDataLoader,
  globalPageValidators,
  PageDataLoaderResult,
} from "./dataLoaders";

export async function getServerSideProps(
  context: ServerSidePropsContext,
  initializeLocal: (
    context: ServerSidePropsContext,
    containerInstance: ContainerInstance,
  ) => Promise<PageDataLoaderResult | NextPageSystemResult>,
  {
    beforeLoad,
  }: {
    beforeLoad: (context: ServerSidePropsContext) => BeforeLoadResult | Promise<BeforeLoadResult>;
  },
) {
  const { container, dispose } = createScopedContainer();
  try {
    const beforeLoadResult = await beforeLoad(context);
    if (beforeLoadResult) return beforeLoadResult;

    let stopByInternalPageLoader: NextPageSystemResult | null = null;
    const internalPageLoaderResult = await Promise.all(
      [...globalInternalPageDataLoader.values()].map((func) =>
        func(context, container).then((data) => {
          if (isArray(data)) return data;
          stopByInternalPageLoader = data;
        }),
      ),
    );

    if (stopByInternalPageLoader) return stopByInternalPageLoader;

    const asyncPageLoaderPromise = Promise.all(
      [...globalAsyncPageDataLoader.values()].map((func) => func(context, container)),
    )
      .then((value) => ({ __value: value }))
      .catch((error) => ({ __error: error }));

    let stopByExternalPageLoader: NextPageSystemResult | null = null;
    const externalPageLoaderResult = await Promise.all(
      [...globalExternalPageDataLoader.values()].map((func) =>
        func(context, container).then((data) => {
          if (isArray(data)) return data;
          stopByExternalPageLoader = data;
        }),
      ),
    );

    if (stopByExternalPageLoader) return stopByExternalPageLoader;

    for (const [, validator] of globalPageValidators) {
      const result = await validator(context, container);
      if (result) {
        await waitForAsyncPageLoaderResult(asyncPageLoaderPromise);
        return result;
      }
    }

    const localLoaderResult = await initializeLocal(context, container);
    if (!isArray(localLoaderResult)) {
      await waitForAsyncPageLoaderResult(asyncPageLoaderPromise);
      return localLoaderResult;
    }

    const asyncPageLoaderResult = await waitForAsyncPageLoaderResult(asyncPageLoaderPromise);
    if (!isArray(asyncPageLoaderResult)) return asyncPageLoaderResult;

    return {
      props: {
        pageDataLoaderResult: getPageDataLoaderResult({
          internalPageLoaderResult: internalPageLoaderResult as PageDataLoaderResult[],
          asyncPageLoaderResult,
          externalPageLoaderResult: externalPageLoaderResult as PageDataLoaderResult[],
          localLoaderResult,
        }),
      },
    };
  } finally {
    dispose();
  }
}

function getPageDataLoaderResult({
  internalPageLoaderResult,
  asyncPageLoaderResult,
  externalPageLoaderResult,
  localLoaderResult,
}: {
  internalPageLoaderResult: PageDataLoaderResult[];
  asyncPageLoaderResult: PageDataLoaderResult[];
  externalPageLoaderResult: PageDataLoaderResult[];
  localLoaderResult: PageDataLoaderResult;
}) {
  return uniqBy(
    (result) => result.token,
    [...internalPageLoaderResult, ...asyncPageLoaderResult, ...externalPageLoaderResult, localLoaderResult]
      .flat()
      .reverse(),
  );
}

function waitForAsyncPageLoaderResult(
  waitForAsyncPageLoaderPromise: Promise<
    { __error: any } | { __value: (PageDataLoaderResult | NextPageSystemResult)[] }
  >,
) {
  return new Promise<PageDataLoaderResult[] | NextPageSystemResult>((resolve, reject) => {
    waitForAsyncPageLoaderPromise.then((data) => {
      if ("__value" in data) {
        const nextPageSystemResult = data.__value.find((result) => !isArray(result)) as
          | NextPageSystemResult
          | undefined;
        if (nextPageSystemResult) return resolve(nextPageSystemResult);
        resolve(data.__value as PageDataLoaderResult[]);
      } else {
        reject(data.__error);
      }
    });
  });
}

export * from "./dataLoaders";
