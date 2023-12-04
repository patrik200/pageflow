import { AppRequestError } from "@app/kit";

import { parseServerError } from "../parseServerError";

function createError(errors: string[]) {
  return new AppRequestError({
    message: "",
    statusCode: 400,
    response: { data: { errors } } as any,
  });
}

test("parse error from server", () => {
  expect(parseServerError(createError([]))).toEqual(false);
  expect(parseServerError(createError(["text;; 1"]))).toEqual([{ field: "text", message: "1" }]);
  expect(parseServerError(createError(["options.0.price;; Some error"]))).toEqual([
    { field: "options.0.price", message: "Some error" },
  ]);
});

test("parse error from server with code field matching", () => {
  expect(parseServerError(createError(["text;; 1"]), { text: "text_2" })).toEqual([{ field: "text_2", message: "1" }]);
});
