import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<T> {
  protected submit: HTMLButtonElement;
  protected errors: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.submit = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );

    this.errors = ensureElement<HTMLElement>(".form__errors", this.container);

    container.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.name) {
        this.events.emit("form:change", {
          field: target.name as keyof Component<T>,
          value: target.value,
        });
      }
    });
  }

  set errorText(value: string) {
    this.errors.textContent = value;
  }

  set isValid(value: boolean) {
    this.submit.toggleAttribute("disabled", !value);
  }
}
