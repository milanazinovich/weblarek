import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { IOrderForm, TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";

export class OrderForm extends Form<IOrderForm> {
  protected addressInput: HTMLInputElement;
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

    this.cardButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.events.emit("order:payment-change", {
        field: "payment",
        value: "card",
      });
    });

    this.cashButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.events.emit("order:payment-change", {
        field: "payment",
        value: "cash",
      });
    });

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set selectedPayment(payment: TPayment | undefined) {
    this.cardButton.classList.remove("button_alt-active");
    this.cashButton.classList.remove("button_alt-active");

    if (payment === "card") {
      this.cardButton.classList.add("button_alt-active");
    } else if (payment === "cash") {
      this.cashButton.classList.add("button_alt-active");
    }
  }
}