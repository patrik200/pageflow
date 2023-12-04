export enum Tariffs {
  START = "start",
  ON_PREMISE = "on-premise",
}

export const tariffsFixture = new Map([
  [
    Tariffs.START,
    {
      name: { ru: "Облако" },
      available: true,
      price: 2000,
    },
  ],
  [
    Tariffs.ON_PREMISE,
    {
      name: { ru: "Коробочный" },
      available: false,
      price: null,
    },
  ],
]);
