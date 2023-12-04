import { parseServerErrorMessages } from "../parseServerErrorMessages";

test("parse error messages - unexpected error", () => {
  const stringError = jest.fn();
  const unexpectedError = jest.fn();

  parseServerErrorMessages(false, [], { unexpectedError, stringError });
  expect(stringError).toHaveBeenCalledTimes(0);
  expect(unexpectedError).toHaveBeenCalledTimes(1);
});

test("parse error messages - string error", () => {
  const stringError = jest.fn();
  const unexpectedError = jest.fn();

  parseServerErrorMessages("some error", ["name"], { unexpectedError, stringError });

  expect(stringError).toHaveBeenCalledWith("some error");
  expect(unexpectedError).toHaveBeenCalledTimes(0);
});

test("parse error messages - errors array", () => {
  const stringError = jest.fn();
  const unexpectedError = jest.fn();
  const fieldError = jest.fn();

  parseServerErrorMessages(
    [
      { field: "name", message: "should exists" },
      { field: "surname", message: "should exists surname" },
    ],
    ["name"],
    { unexpectedError, stringError, fieldError },
  );

  expect(unexpectedError).toHaveBeenCalledTimes(0);
  expect(stringError).toHaveBeenCalledWith("should exists surname");
  expect(fieldError).toHaveBeenCalledWith("name", "should exists");
});

test("parse error messages - errors array with nested errors", () => {
  const stringError = jest.fn();
  const unexpectedError = jest.fn();
  const fieldError = jest.fn();

  parseServerErrorMessages(
    [
      { field: "name.1.title", message: "one" },
      { field: "name.2.title", message: "two" },
      { field: "name.3.description", message: "three" },
    ],
    ["name.{index}.title", "name.{index}.description"],
    {
      unexpectedError,
      stringError,
      fieldError,
    },
  );

  expect(unexpectedError).toHaveBeenCalledTimes(0);
  expect(stringError).toHaveBeenCalledTimes(0);
  expect(fieldError).toHaveBeenCalledWith("name.1.title", "one");
  expect(fieldError).toHaveBeenCalledWith("name.2.title", "two");
  expect(fieldError).toHaveBeenCalledWith("name.3.description", "three");
});

test("parse error messages - custom fields", () => {
  const stringError = jest.fn();
  const unexpectedError = jest.fn();
  const fieldError = jest.fn();

  parseServerErrorMessages(
    [{ field: "title", message: "from title" }],
    ["name"],
    {
      unexpectedError,
      stringError,
      fieldError,
    },
    { title: "name" },
  );
  expect(stringError).toHaveBeenCalledTimes(0);
  expect(unexpectedError).toHaveBeenCalledTimes(0);
  expect(fieldError).toHaveBeenCalledWith("name", "from title");
});
