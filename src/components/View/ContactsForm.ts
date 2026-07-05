import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { IContact } from "../../types";
import { ensureElement } from "../../utils/utils";

export class ContactsForm extends Form<IContact> {
  protected email: HTMLInputElement;
  protected phone: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.email = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    
    container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  set emailValue(value: string) {
    this.email.value = value;
  }

  set phoneValue(value: string) {
    this.phone.value = value;
  }
}
