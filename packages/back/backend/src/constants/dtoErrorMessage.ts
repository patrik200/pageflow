import { createClassValidatorErrorMessage } from "@app/back-kit";

export const dtoMessageIsDefined = createClassValidatorErrorMessage({ message: "Должно быть определено" });
export const dtoMessageIsValidValue = createClassValidatorErrorMessage({
  message: "Должно содержать валидное значение",
});
