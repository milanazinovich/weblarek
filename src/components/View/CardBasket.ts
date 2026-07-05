import { BaseCard } from "./BaseCard";
import { IEvents } from "../base/Events";
import { IBasketItem } from "../../types";
import { ensureElement } from "../../utils/utils";

export class CardBasket extends BaseCard<IBasketItem> {
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor(
    container: HTMLElement,
    events: IEvents,
    private onRemove: (e: Event) => void,
  ) {
    super(container, events);

    this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);
    this.indexElement = ensureElement<HTMLElement>(".basket__item-index", this.container);

    this.deleteButton.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      this.onRemove(e);
    });
  }

  // Сеттер для индекса
  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}