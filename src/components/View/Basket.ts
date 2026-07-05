import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IBasketData } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Basket extends Component<IBasketData> {
  protected list: HTMLElement;
  protected total: HTMLElement;
  protected submit: HTMLButtonElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.list = ensureElement<HTMLElement>(".basket__list", this.container);
    this.total = ensureElement<HTMLElement>(".basket__price", this.container);
    this.submit = ensureElement<HTMLButtonElement>(".basket__button", this.container);

    this.submit.addEventListener("click", () => {
      this.events.emit("basket:submit");
    });
  }

  set items(items: HTMLElement[]) {
    this.list.replaceChildren(...items);
    this.submit.disabled = items.length === 0;
  }

  set totalPrice(value: number) {
    this.total.textContent = `${value} синапсов`;
  }
}
