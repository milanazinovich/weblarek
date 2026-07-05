import { CatalogCard } from "./CatalogCard";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class ModalCard extends CatalogCard {
  protected buttonElement: HTMLButtonElement;
  protected descriptionElement: HTMLElement;

  constructor(
    container: HTMLElement,
    events: IEvents,
    onClick: (e: Event) => void,
  ) {
    super(container, events, onClick);

    this.buttonElement = ensureElement<HTMLButtonElement>(".button", this.container);
    this.descriptionElement = ensureElement<HTMLElement>(".card__text", this.container);

    this.buttonElement.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      this.events.emit("card:buy");
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}