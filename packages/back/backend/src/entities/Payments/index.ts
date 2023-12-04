import { BaseGeneratedIDEntity } from "@app/back-kit";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { PaymentMode, PaymentStatus } from "@app/shared-enums";

import { ClientEntity } from "entities/Client";
import { SubscriptionEntity } from "entities/Subscription";
import { UserEntity } from "entities/User";

@Entity({ name: "client_payments" })
export class PaymentEntity extends BaseGeneratedIDEntity {
  @ManyToOne(() => ClientEntity, { onDelete: "CASCADE", nullable: false })
  client!: ClientEntity;

  @Index()
  @Column({ nullable: true })
  externalPaymentId!: string;

  @Index()
  @Column({ type: "enum", enum: PaymentStatus })
  status!: PaymentStatus;

  @Column({ type: "enum", enum: PaymentMode })
  mode!: PaymentMode;

  @Column()
  amount!: number;

  @Column({ type: "varchar", nullable: true })
  paymentMethodId!: string | null;

  @Column({ type: "varchar", nullable: true, length: 128 })
  description!: string | null;

  @Column({ type: "varchar", nullable: true })
  confirmationUrl!: string | null;

  @ManyToOne(() => UserEntity, { nullable: false })
  author!: UserEntity;

  @ManyToOne(() => SubscriptionEntity, (subscription) => subscription.payments, { nullable: false })
  subscription!: SubscriptionEntity;

  get paymentInProgress() {
    return this.status === PaymentStatus.WAITING_FOR_PAYMENT || this.status === PaymentStatus.WAITING_FOR_ACCEPT;
  }
}
