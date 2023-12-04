import { ContainerInstance } from "typedi";

import { NextPageSystemResult, ServerSidePropsContext } from "../types";

export type PageDataLoaderResult = { token: string; plainObject: Object }[];

type CancelableGlobalPageDataLoader = (
  context: ServerSidePropsContext,
  containerInstance: ContainerInstance,
) => Promise<PageDataLoaderResult | NextPageSystemResult>;

type GlobalBrowserInitializer = (containerInstance: ContainerInstance) => void;

type GlobalPageValidator = (
  context: ServerSidePropsContext,
  containerInstance: ContainerInstance,
) => Promise<NextPageSystemResult | null> | NextPageSystemResult | null;

export const globalInternalPageDataLoader = new Map<string, CancelableGlobalPageDataLoader>();
export const globalAsyncPageDataLoader = new Map<string, CancelableGlobalPageDataLoader>();
export const globalExternalPageDataLoader = new Map<string, CancelableGlobalPageDataLoader>();
export const globalBrowserInitializer = new Map<string, GlobalBrowserInitializer>();
export const globalPageValidators = new Map<string, GlobalPageValidator>();

export type BeforeLoadResult = NextPageSystemResult | null;
