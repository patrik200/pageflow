import React from "react";
import { observer } from "mobx-react-lite";
import { getErrorMessageWithCommonIntl, parseServerErrorCodeAndMessages, useTranslation } from "@app/front-kit";
import axios from "axios";
import { useAsyncFn } from "@worksolutions/react-utils";
import { nbspString } from "@worksolutions/utils";

import Typography from "components/Typography";
import Input from "components/Input";
import Checkbox from "components/Checkbox";
import Spinner from "components/Spinner";

import { RequestFormEntity } from "core/storages/profile/entities/RequestFormEntity";

import {
  checkboxLinkStyles,
  checkboxTextStyles,
  checkboxWrapperStyles,
  domainFieldLeftTextStyles,
  domainFieldRightTextStyles,
  errorTextStyles,
  formInputsRowStyles,
  formWrapperStyles,
  registerButtonStyles,
  spinnerStyles,
  successTextStyles,
  titleStyles,
  wrapperStyles,
} from "./style.css";

const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";

function parseError(e: unknown): string | null {
  if (!axios.isAxiosError(e)) return null;
  const data = e.response?.data as Record<string, any> | undefined;
  if (!data) return null;
  if (!("message" in data)) return null;
  const errors = parseServerErrorCodeAndMessages(data.message);
  if (!errors) return null;
  const [error] = errors;
  if (!error) return null;
  if (error.field !== "error") return null;
  return error.message;
}

function RequestForm() {
  const { t } = useTranslation();
  const entity = React.useMemo(() => RequestFormEntity.buildEmpty(), []);

  const handleSend = React.useCallback(async () => {
    entity.setSuccessMessage("");
    entity.setErrorMessage("");
    try {
      await axios.post("/api/landing/request", entity.apiReady, { baseURL });
      entity.setSuccessMessage(
        "Стенд будет развернут в течении нескольких минут. По окончании Вам прийдет email со всеми данными",
      );
      console.log("success!!");
    } catch (e) {
      console.log("error----", e);
      const error = parseError(e);
      if (!error || error === "unexpected_error") {
        entity.setErrorMessage("Произошла непредвиденная ошибка. Подождите немного и попробуйте еще раз");
        return;
      }
      switch (error) {
        case "domain_already_created":
          entity.setErrorMessage("Этот домен уже использутся. Пожалуйста, попробуйте другой");
          return;
        case "bad_domain":
          entity.setErrorMessage("Введен не корректный домен. Пожалуйста, попробуйте другой");
          return;
      }
    }
  }, [entity]);

  const [{ loading }, asyncHandleSend] = useAsyncFn(handleSend, [handleSend]);

  const handleButtonClick = React.useCallback(() => {
    entity.submit({ onSuccess: asyncHandleSend });
  }, [entity, asyncHandleSend]);

  return (
    <div id="request_form" className={wrapperStyles}>
      <Typography className={titleStyles}>Попробуйте в действии</Typography>
      <div className={formWrapperStyles}>
        <div className={formInputsRowStyles}>
          <Input
            title="Ваше имя"
            value={entity.name}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.name, t)}
            onChangeInput={entity.setName}
          />
          <Input
            title="Ваш email"
            value={entity.email}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.email, t)}
            onChangeInput={entity.setEmail}
          />
        </div>
        <div className={formInputsRowStyles}>
          <Input
            title="Название компании"
            value={entity.companyName}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.companyName, t)}
            onChangeInput={entity.setCompanyName}
          />
          <Input
            title="Домен"
            leftItem={<Typography className={domainFieldLeftTextStyles}>https://</Typography>}
            rightItem={<Typography className={domainFieldRightTextStyles}>.pageflow.ru</Typography>}
            value={entity.domain}
            errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.domain, t)}
            onChangeInput={entity.setDomain}
          />
        </div>
      </div>
      <div className={checkboxWrapperStyles}>
        <Checkbox
          value={entity.privacy}
          onChange={entity.setPrivacy}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.privacy, t)}
        >
          <Typography className={checkboxTextStyles}>
            <a href="/privacy" target="_blank" className={checkboxLinkStyles}>
              Политика конфиденциальности персональных данных
            </a>
            {nbspString}и{nbspString}
            <a href="/terms" target="_blank" className={checkboxLinkStyles}>
              Лицензионное соглашение
            </a>
          </Typography>
        </Checkbox>
      </div>
      {entity.successMessage && <Typography className={successTextStyles}>{entity.successMessage}</Typography>}
      {entity.errorMessage && <Typography className={errorTextStyles}>{entity.errorMessage}</Typography>}
      {loading && <Spinner className={spinnerStyles} />}
      <button className={registerButtonStyles} disabled={loading} onClick={handleButtonClick}>
        Зарегистрироваться
      </button>
    </div>
  );
}

export default observer(RequestForm);
