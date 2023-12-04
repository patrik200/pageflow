import { ServerSidePropsContext } from "@app/front-kit";
import { ContainerInstance } from "typedi";
import { waitFor } from "@worksolutions/utils";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

import { getTokenValid } from "../profile";

export async function initializeDictionaries(context: ServerSidePropsContext, container: ContainerInstance) {
  try {
    await waitFor(() => getTokenValid(context) !== undefined, 10000, 40);
    if (!getTokenValid(context)) return false;
    const dictionariesCommonStorage = container.get(DictionariesCommonStorage);
    const dictionariesResult = await dictionariesCommonStorage.loadDictionaries();
    return dictionariesResult.success;
  } catch (e) {
    return false;
  }
}
