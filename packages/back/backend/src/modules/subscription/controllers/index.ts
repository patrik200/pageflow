import { Body, Controller, Get, Post } from "@nestjs/common";
import { ControllerResponse } from "@app/back-kit";

import { withUserAuthorized } from "modules/auth";

import { GetSubscriptionService } from "../services/get";
import { BuySubscriptionService } from "../services/buy";
import { CancelSubscriptionService } from "../services/cancel";

import { ResponseSubscriptionDTO } from "../dto/get/subscription/Subscription";
import { RequestBuySubscriptionDTO, ResponseBuySubscriptionDTO } from "../dto/get/subscription/BuySubscription";
import { ResponsePaymentsListDTO } from "../dto/get/payment/Payment";

@Controller("subscription")
export class SubscriptionController {
  constructor(
    private getSubscriptionService: GetSubscriptionService,
    private buySubscriptionService: BuySubscriptionService,
    private cancelSubscriptionService: CancelSubscriptionService,
  ) {}

  @Get()
  @withUserAuthorized([])
  async getSubscriptionInfo() {
    const subscription = await this.getSubscriptionService.getSubscriptionInfoForCurrentUser();
    return new ControllerResponse(ResponseSubscriptionDTO, subscription);
  }

  @Get("payments")
  @withUserAuthorized([])
  async getPaymentsList() {
    const payments = await this.getSubscriptionService.getPaymentsList();
    return new ControllerResponse(ResponsePaymentsListDTO, { list: payments });
  }

  @Post("buy")
  @withUserAuthorized([], { processAsGet: true })
  async buySubscription(@Body() body: RequestBuySubscriptionDTO) {
    const result = await this.buySubscriptionService.buySubscriptionOrFail({ paymentType: body.paymentType });
    return new ControllerResponse(ResponseBuySubscriptionDTO, result);
  }

  @Post("cancel")
  @withUserAuthorized([], { processAsGet: true })
  async cancelSubscription() {
    await this.cancelSubscriptionService.cancelSubscriptionOrFail();
  }
}
