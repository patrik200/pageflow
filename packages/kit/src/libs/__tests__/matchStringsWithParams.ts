import { matchStringsWithParams } from "../matchStringsWithParams";

test("match strings with params", () => {
  expect(matchStringsWithParams("/data").match("/data")).toEqual({});
  expect(matchStringsWithParams("/data").match("/data/ododod")).toEqual(false);
  expect(matchStringsWithParams("/data").match("/some")).toBe(false);
  expect(matchStringsWithParams("/data/{i}").match("/data")).toBe(false);
  expect(matchStringsWithParams("/data/{id}").match("/data/2")).toEqual({ id: "2" });
  expect(matchStringsWithParams("/data/{id}/you").match("/data/2/you")).toEqual({ id: "2" });
  expect(matchStringsWithParams("/data/{id}").match("/data/2/asd")).toEqual({ id: "2/asd" });
  expect(matchStringsWithParams("/data/{id}/{some}").match("/data/2/asd")).toEqual({ id: "2", some: "asd" });
  expect(matchStringsWithParams("/data/{key!wow,tutu}").match("/data/some")).toEqual({ key: "some" });
  expect(matchStringsWithParams("/data/{key!wow,tutu}").match("/data/tutu")).toEqual(false);

  const s = `/places/{id@/subcategories+,nano!search+}`;
  expect(matchStringsWithParams(s).match("/places/123")).toEqual({ id: "123" });
  expect(matchStringsWithParams(s).match("/places/123/123")).toEqual({ id: "123/123" });
  expect(matchStringsWithParams(s).match("/places/search/my")).toEqual(false);
  expect(matchStringsWithParams(s).match("/places/123/subcategories")).toEqual(false);
  expect(matchStringsWithParams(s).match("/places/123/nano")).toEqual(false);
  expect(matchStringsWithParams(s).match("/places/123/subcategories?d=5")).toEqual(false);

  expect(matchStringsWithParams(`/places/{id!cities+}`).match("/places/5")).toEqual({ id: "5" });
  expect(matchStringsWithParams(`/places/{id!cities+}`).match("/places/cities")).toEqual(false);
  expect(matchStringsWithParams(`/places/{id!cities}`).match("/places/cities")).toEqual(false);
  expect(matchStringsWithParams(`/places/{id!cities+}`).match("/places/cities2")).toEqual(false);
  expect(matchStringsWithParams(`/places/{id!cities}`).match("/places/cities2")).toEqual({ id: "cities2" });

  expect(matchStringsWithParams("/data/{rrr}").convertedReferenceString).toBe("/data/{rrr}");
  expect(matchStringsWithParams("/data/{test!qwerty}").convertedReferenceString).toBe("/data/{test}");

  expect(matchStringsWithParams("/{place_id!cities+}").convertedReferenceString).toBe("/{place_id}");

  expect(matchStringsWithParams(`/api/data/{id!delivery-zon._e!/?&=}`).match("/api/data/hr")).toEqual({ id: "hr" });
});
