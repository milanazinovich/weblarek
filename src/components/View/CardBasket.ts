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
    private productId: string,
  ) {
    super(container, events);

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );

    if (this.deleteButton) {
      this.deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.events.emit("basket:remove", { id: this.productId });
      });
    }
  }

  render(data?: Partial<IBasketItem>): HTMLElement {
    super.render(data);

    if (!data) {
      return this.container;
    }

    if (data.index !== undefined) {
      this.indexElement.textContent = String(data.index);
    }

    return this.container;
  }
}
