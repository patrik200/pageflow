export class SubscriptionPayedAtLeastOneTimeUpdated {
  static eventName = "subscription.payedAtLeastOneTimeUpdated";

  constructor(public subscriptionId: string) {}
}
