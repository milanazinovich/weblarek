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

    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:payment-change", {
        field: "address",
        value: this.addressInput.value,
      });
    });

    this.cardButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.setPayment("card");
      this.events.emit("order:payment-change", {
        field: "payment",
        value: "card",
      });
    });

    this.cashButton.addEventListener("click", (event) => {
      event.preventDefault();
      this.setPayment("cash");
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

  protected setPayment(payment: TPayment): void {
    this.cardButton.classList.remove("button_alt-active");
    this.cashButton.classList.remove("button_alt-active");

    if (payment === "card") {
      this.cardButton.classList.add("button_alt-active");
    } else if (payment === "cash") {
      this.cashButton.classList.add("button_alt-active");
    }
  }

  render(data?: Partial<IOrderForm>): HTMLElement {
    if (data) {
      if (data.address !== undefined) {
        this.addressInput.value = data.address;
      }
      if (data.payment !== undefined) {
        this.setPayment(data.payment);
      } else {
        this.cardButton.classList.remove("button_alt-active");
        this.cashButton.classList.remove("button_alt-active");
      }
    }

    return this.container;
  }
}
