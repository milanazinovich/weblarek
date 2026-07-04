import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IBaseCard } from "../../types";
import { ensureElement } from "../../utils/utils";

export abstract class BaseCard<T extends IBaseCard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  render(data?: Partial<T>): HTMLElement {
    if (data) {
      if (data.title !== undefined) {
        this.titleElement.textContent = data.title;
      }

      if (data.price !== undefined) {
        this.priceElement.textContent =
          data.price === null ? "Бесценно" : `${data.price} синапсов`;
      }
    }

    return this.container;
  }
}
