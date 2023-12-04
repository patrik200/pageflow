import React from "react";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import Head from "next/head";
import { getErrorMessageWithCommonIntl, useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button, Form, PasswordField, TextField } from "@app/ui-kit";

import { Link } from "components/Link";

import { emitRequestError } from "core/emitRequest";

import { ProfileStorage } from "core/storages/profile/profile";

import AuthPageWrapper from "../Wrapper";
import { AuthorizationEntity } from "./authorizationEntity";

import { actionStyles, formStyles, restorePasswordStyles } from "./style.css";

function AuthLoginView() {
  const { t } = useTranslation("auth-login");
  const { replace } = useRouter();
  const profileStorage = useViewContext().containerInstance.get(ProfileStorage);

  const entity = React.useMemo(() => AuthorizationEntity.buildEmpty(), []);

  const handleLogin = React.useCallback(async () => {
    const result = await profileStorage.login(entity.email, entity.password);
    if (result.success) {
      await replace.current("/");
      return;
    }

    emitRequestError(entity, result.error, t({ scope: "error_messages", name: "unexpected" }));
  }, [entity, replace, t, profileStorage]);

  const [{ loading }, asyncHandleLogin] = useAsyncFn(handleLogin, [handleLogin]);

  const handleSubmit = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleLogin }),
    [entity, asyncHandleLogin],
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
          <PasswordField
            materialPlaceholder={false}
            label={t({ scope: "content", place: "fields", name: "password", parameter: "title" })}
            placeholder={t({ scope: "content", place: "fields", name: "password", parameter: "placeholder" })}
            value={entity.password}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.password, t)}
            absoluteTemplatingError
            onChangeInput={entity.setPassword}
          />
          <Button className={actionStyles} loading={loading} onClick={handleSubmit}>
            {t({ scope: "content", name: "signInButton" })}
          </Button>
          <Link className={restorePasswordStyles} href="/auth/reset-password">
            Забыли пароль?
          </Link>
        </Form>
      </AuthPageWrapper>
    </>
  );
}

export default observer(AuthLoginView);
