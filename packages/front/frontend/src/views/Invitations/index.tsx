import React from "react";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Spinner, Typography } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { InvitationPayloadEntity } from "core/entities/invitation";

import { InvitationStorage } from "core/storages/invites";

import InvitationSubmitForm from "./InvitationSubmitForm";

import {
  contentContainer,
  contentWrapperStyle,
  formContainer,
  rootWrapperStyle,
  spinnerStyles,
  spinnerWrapperStyles,
  titleStyles,
} from "./styles.css";

function InvitationsView() {
  const { t } = useTranslation("invitation");

  const [invitation, setInvitation] = React.useState<InvitationPayloadEntity | null>(null);

  const { push, ...router } = useRouter();
  const { id: invitationToken } = router.query as { id: string };

  const { verifyInvitation } = useViewContext().containerInstance.get(InvitationStorage);

  const handleTokenVerification = React.useCallback(async () => {
    const result = await verifyInvitation(invitationToken);
    if (result.success) {
      setInvitation(result.invitation);
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "messages", place: "verification", name: "unexpected_error" }),
    );
    await push.current("/auth/login");
  }, [verifyInvitation, invitationToken, t, push]);

  const [{ loading }, asyncHandleTokenVerification] = useAsyncFn(handleTokenVerification, [handleTokenVerification], {
    loading: true,
  });

  React.useEffect(() => void asyncHandleTokenVerification(), [asyncHandleTokenVerification]);

  return (
    <>
      <Head>
        <title>{t({ scope: "meta", place: "submit", name: "title" })}</title>
      </Head>
      <div className={rootWrapperStyle}>
        <div className={contentWrapperStyle}>
          <div className={contentContainer}>
            <Typography className={titleStyles}>{t({ scope: "meta", place: "submit", name: "title" })}</Typography>
            <div className={formContainer}>
              {loading || invitation === null ? (
                <div className={spinnerWrapperStyles}>
                  <Spinner className={spinnerStyles} />
                </div>
              ) : (
                <InvitationSubmitForm invitation={invitation} invitationToken={invitationToken} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default observer(InvitationsView);
