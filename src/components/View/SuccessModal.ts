import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ISuccess } from "../../types";
import { ensureElement } from "../../utils/utils";

export class SuccessModal extends Component<ISuccess> {
  protected description: HTMLElement;
  protected closeButton: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.description = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButton = ensureElement<HTMLElement>(
      ".order-success__close",
      this.container,
    );
    this.closeButton.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  render(data?: Partial<ISuccess>): HTMLElement {
    if (data && data.total !== undefined) {
      this.description.textContent = `Списано ${data.total} синапсов`;
    }
    return this.container;
  }
}
