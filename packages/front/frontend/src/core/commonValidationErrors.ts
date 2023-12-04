import { createCustomValidationError } from "@app/front-kit";

export const EMAIL_VALIDATION = createCustomValidationError("should_be_an_email");
export const PHONE_VALIDATION = createCustomValidationError("should_be_a_phone");
export const NOT_EMPTY_VALIDATION = createCustomValidationError("should_not_be_empty");
export const PASSWORDS_SHOULD_BE_EQUALS = createCustomValidationError("passwords_should_be_equal");
export const URL_VALIDATION = createCustomValidationError("should_be_an_url");
export const END_DATE_SHOULD_BE_AFTER_START_DATE = createCustomValidationError("end_date_should_be_after_start_date");

// TODO: вынести сообщение на уровень переводов для страницы
export const USER_FLOW_DEADLINE_DAYS_AMOUNT_VALIDATION = createCustomValidationError(
  "user_flow_deadline_days_amount_validation",
);
