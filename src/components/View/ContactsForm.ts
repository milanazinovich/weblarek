import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { IContact } from "../../types";
import { ensureElement } from "../../utils/utils";

export class ContactsForm extends Form<IContact> {
  protected email: HTMLInputElement;
  protected phone: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.email = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phone = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
    
    container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit("contacts:submit");
    });

    this.email.addEventListener("input", () => {
      this.events.emit("order:contacts-change", {
        field: "email",
        value: this.email.value,
      });
    });

    this.phone.addEventListener("input", () => {
      this.events.emit("order:contacts-change", {
        field: "phone",
        value: this.phone.value,
      });
    });
  }

  render(data?: Partial<IContact>): HTMLElement {
    if (data) {
      if (data.email !== undefined) {
        this.email.value = data.email;
      }

      if (data.phone !== undefined) {
        this.phone.value = data.phone;
      }
    }

    return this.container;
  }
}
