import { createCustomValidationError } from "@app/front-kit";

export const EMAIL_VALIDATION = createCustomValidationError("should_be_an_email");
export const NOT_EMPTY_VALIDATION = createCustomValidationError("should_not_be_empty");
export const PRIVACY_VALIDATION = createCustomValidationError("should_be_privacy_confirmed");
