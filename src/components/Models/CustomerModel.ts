import { IEvents } from "../base/Events";
import { IBuyer, TPayment, ValidationErrors } from "../../types";

export class CustomerModel {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit("customer:change");
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit("customer:change");
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("customer:change");
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit("customer:change");
  }

  getOrderData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("customer:change");
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!this.payment) errors.payment = "Не выбран вид оплаты";
    if (!this.email) errors.email = "Укажите емэйл";
    if (!this.phone) errors.phone = "Укажите телефон";
    if (!this.address) errors.address = "Укажите адрес";

    return errors;
  }
}
