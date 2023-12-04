import { ContainerInstance } from "typedi";
import {
  fastAccessJWTParse,
  getAllRequestManagers,
  prepareRequestManagersToSendToken,
  removeTokenFromContext,
  saveTokenEntityToContext,
  ServerSidePropsContext,
  syncTokenAndTokenProxy,
} from "@app/front-kit";

import { ProfileStorage } from "core/storages/profile/profile";

function setTokenValid(context: ServerSidePropsContext, valid: boolean | undefined) {
  (context.req as any).__tokenValid = valid;
}

export async function handleToken(context: ServerSidePropsContext, container: ContainerInstance) {
  setTokenValid(context, undefined);

  if (!context.req.cookies.token) {
    setTokenValid(context, false);
    return false;
  }

  const parsedToken = fastAccessJWTParse(context.req.cookies.token);
  if (!parsedToken) {
    setTokenValid(context, false);
    removeTokenFromContext(context);
    return false;
  }

  const rollbackTokenSending = prepareRequestManagersToSendToken(
    { token: context.req.cookies.token, refreshToken: context.req.cookies.refresh_token },
    getAllRequestManagers(container),
  );

  if (Date.now() < parsedToken.expirationAt) {
    syncTokenAndTokenProxy(context.req.cookies, context.res);
    setTokenValid(context, true);
    return true;
  }

  const success = await handleTokenExpired(context, container, rollbackTokenSending);
  setTokenValid(context, success);

  return success;
}

async function handleTokenExpired(
  context: ServerSidePropsContext,
  container: ContainerInstance,
  rollbackTokenSending: Function,
) {
  const profileStorage = container.get(ProfileStorage);

  const allRollbacks: { rollbackRequestManager?: Function } = {};

  const refreshResult = await profileStorage.refreshToken();
  if (refreshResult.success) {
    rollbackTokenSending();
    saveTokenEntityToContext(context, refreshResult.token);
    allRollbacks.rollbackRequestManager = prepareRequestManagersToSendToken(
      refreshResult.token,
      getAllRequestManagers(container),
    );

    return true;
  }

  rollbackTokenSending();
  if (allRollbacks.rollbackRequestManager) allRollbacks.rollbackRequestManager();
  removeTokenFromContext(context);
  return false;
}
