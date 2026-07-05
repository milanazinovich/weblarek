import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IHeader {
  counter: number;
}

export class HeaderBasket extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private onClick: () => void,
  ) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(".header__basket-counter", this.container);
    this.basketButton = ensureElement<HTMLButtonElement>(".header__basket", this.container);

    this.basketButton.addEventListener("click", () => {
      this.onClick();
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}