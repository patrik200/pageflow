import { NextPageSystemResult, PageDataLoaderResult, ServerSidePropsContext } from "@app/front-kit";
import { ContainerInstance } from "typedi";

import { ClientCommonStorage } from "core/storages/client/client-common";

export async function initializeClient(
  context: ServerSidePropsContext,
  container: ContainerInstance,
): Promise<PageDataLoaderResult | NextPageSystemResult> {
  const [domain] = context.req.headers["host"].split(":");
  if (!domain) return { notFound: true };
  const clientCommonStorage = container.get(ClientCommonStorage);
  const { success } = await clientCommonStorage.loadClient(domain);
  if (!success) return { notFound: true } as const;
  return [{ token: ClientCommonStorage.token, plainObject: clientCommonStorage.plainObject }];
}
