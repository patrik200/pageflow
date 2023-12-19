import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { DateTime } from "luxon";
import { isDateBefore } from "@worksolutions/utils";
import { config } from "@app/core-config";

import { ClientEntity } from "entities/Client";

import { Tariffs, tariffsFixture } from "fixtures/tariffs";

import { PaymentEntity } from "../Payments";

@Entity({ name: "clients_subscriptions" })
export class SubscriptionEntity extends BaseGeneratedIDEntity {
  @Column({ type: "enum", enum: Tariffs })
  tariff!: Tariffs;

  @JoinColumn()
  @OneToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @Index()
  @Column({ type: "timestamptz", nullable: true })
  payedUntil!: Date | null;

  @Index()
  @Column({ default: false })
  payedAtLeastOneTime!: boolean;

  @Column({ type: "varchar", nullable: true })
  autoRenewPaymentMethodId!: string | null;

  @OneToMany(() => PaymentEntity, (payment) => payment.subscription)
  payments!: PaymentEntity[];

  get active() {
    if (!this.payedUntil) return true;
    return isDateBefore({
      value: DateTime.now(),
      comparisonWith: DateTime.fromJSDate(this.payedUntil).plus({ day: config.subscription.gracePeriodDays }),
    });
  }

  get pureActive() {
    if (!this.payedUntil) return true;
    return isDateBefore({ value: DateTime.now(), comparisonWith: DateTime.fromJSDate(this.payedUntil) });
  }

  get tariffFixture() {
    return tariffsFixture.get(this.tariff)!;
  }

  // virtual fields --------

  get autoPaymentsAvailable() {
    return config.subscription.autoPaymentsAvailable;
  }
}
