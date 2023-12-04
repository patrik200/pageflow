import React from "react";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import Head from "next/head";
import { getErrorMessageWithCommonIntl, useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button, Form, TextField } from "@app/ui-kit";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { ProfileStorage } from "core/storages/profile/profile";

import AuthPageWrapper from "../Wrapper";
import { ResetPasswordEntity } from "./resetPasswordEntity";

import { actionStyles, formStyles } from "./style.css";

function ResetPasswordInitialView() {
  const { t } = useTranslation("auth-reset-password-initial");
  const { replace } = useRouter();
  const { resetPasswordInitial } = useViewContext().containerInstance.get(ProfileStorage);

  const entity = React.useMemo(() => ResetPasswordEntity.buildEmpty(), []);

  const handleReset = React.useCallback(async () => {
    const result = await resetPasswordInitial(entity.email);
    if (result.success) {
      emitRequestSuccess(t({ scope: "success_message", name: "text" }));
      await replace.current("/auth/login");
      return;
    }

    emitRequestError(entity, result.error, t({ scope: "error_messages", name: "unexpected" }));
  }, [resetPasswordInitial, entity, t, replace]);

  const [{ loading }, asyncHandleReset] = useAsyncFn(handleReset, [handleReset]);

  const handleSubmit = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleReset }),
    [entity, asyncHandleReset],
  );

  return (
    <>
      <Head>
        <title>{t({ scope: "meta", name: "title" })}</title>
      </Head>
      <AuthPageWrapper title={t({ scope: "content", name: "title" })}>
        <Form className={formStyles} disabled={loading} onSubmit={handleSubmit}>
          <TextField
            materialPlaceholder={false}
            label={t({ scope: "content", place: "fields", name: "email", parameter: "title" })}
            placeholder={t({ scope: "content", place: "fields", name: "email", parameter: "placeholder" })}
            value={entity.email}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.email, t)}
            absoluteTemplatingError
            onChangeInput={entity.setEmail}
          />
          <Button className={actionStyles} loading={loading} onClick={handleSubmit}>
            {t({ scope: "content", name: "reset_button" })}
          </Button>
        </Form>
      </AuthPageWrapper>
    </>
  );
}

export default observer(ResetPasswordInitialView);
