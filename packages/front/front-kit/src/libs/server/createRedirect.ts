import { ServerSidePropsContext } from "framework/page";
import { NextPageSystemResult } from "framework/page/types";

import { getLanguageUrlByNextContext } from "./getLanguageUrl";

type StatusCode = 301 | 302 | 303 | 307 | 308;

export function createRedirect(
  context: ServerSidePropsContext,
  url: string,
  statusCode: StatusCode = 302,
): NextPageSystemResult {
  const language = getLanguageUrlByNextContext(context);
  return { redirect: { destination: language + url, statusCode } };
}
