import { Injectable } from "@nestjs/common";

import { tariffsFixture } from "fixtures/tariffs";

@Injectable()
export class GetTariffsLandingService {
  async getTariffs() {
    return [...tariffsFixture.entries()].map(([tariffKey, tariff]) => ({
      tariff: tariffKey,
      name: tariff.name.ru,
      available: tariff.available,
      price: tariff.price,
    }));
  }
}
