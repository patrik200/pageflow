import { getAllRequestManagers } from "bootstrap";
import { ContainerInstance } from "typedi";

import { ServerSidePropsContext } from "framework/page";

export function initializeSendRequestHeadersToRequestManager(
  context: ServerSidePropsContext,
  container: ContainerInstance,
) {
  getAllRequestManagers(container).forEach((rm) =>
    rm.beforeRequestMiddleware.push(({ config }) => {
      if (!config.headers) config.headers = {};
      config.headers["accept"] = context.req.headers["accept"];
      config.headers["user-agent"] = context.req.headers["user-agent"];
      config.headers["frontend-host"] = context.req.headers["host"];
      config.headers["frontend-url"] = context.req.url;
    }),
  );
}
