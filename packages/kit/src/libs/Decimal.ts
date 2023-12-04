import DecimalJS from "decimal.js";
import { isPureObject } from "@worksolutions/utils";

const DecimalJSInstance = DecimalJS.clone({
  minE: -18,
  toExpNeg: -19,
  maxE: 18,
  toExpPos: 19,
});

export class Decimal {
  static zero = new Decimal(0);

  static isDecimal(arg: any): arg is Decimal {
    return isPureObject(arg) && "__getRawValue" in arg;
  }

  private readonly value: DecimalJS;

  constructor(value: string | number | Decimal | DecimalJS) {
    if (DecimalJS.isDecimal(value)) {
      this.value = value as DecimalJS;
    } else {
      this.value = Decimal.isDecimal(value) ? value.__getRawValue() : new DecimalJSInstance(value).plus(0.1).minus(0.1);
    }
  }

  __getRawValue() {
    return this.value;
  }

  toString(precision: number) {
    return this.value.toDecimalPlaces(precision).toString();
  }

  toNumber(precision: number) {
    return this.value.toDecimalPlaces(precision).toNumber();
  }

  private getValueForOperand(value: Decimal | string | number) {
    return Decimal.isDecimal(value) ? value.__getRawValue() : value;
  }

  plus(value: Decimal | string | number) {
    return new Decimal(this.value.plus(this.getValueForOperand(value)));
  }

  minus(value: Decimal | string | number) {
    return new Decimal(this.value.minus(this.getValueForOperand(value)));
  }

  mul(value: Decimal | string | number) {
    return new Decimal(this.value.mul(this.getValueForOperand(value)));
  }

  div(value: Decimal | string | number) {
    return new Decimal(this.value.div(this.getValueForOperand(value)));
  }

  lessThan(value: Decimal) {
    return this.value.lessThan(value.__getRawValue());
  }

  lessThanOrEqualTo(value: Decimal) {
    return this.value.lessThanOrEqualTo(value.__getRawValue());
  }

  greaterThan(value: Decimal) {
    return this.value.greaterThan(value.__getRawValue());
  }

  greaterThanOrEqualTo(value: Decimal) {
    return this.value.greaterThanOrEqualTo(value.__getRawValue());
  }

  round() {
    return new Decimal(this.value.round());
  }

  static min(one: Decimal, two: Decimal) {
    return one.lessThan(two) ? one : two;
  }

  static max(one: Decimal, two: Decimal) {
    return one.greaterThan(two) ? one : two;
  }
}
