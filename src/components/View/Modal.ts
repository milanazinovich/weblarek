import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal {
  content?: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLElement;
  protected contentElement: HTMLElement;
  private events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this.closeButton = ensureElement<HTMLElement>(".modal__close", this.container);
    this.contentElement = ensureElement<HTMLElement>(".modal__content", this.container);

    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (e: Event) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }

  setContent(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }

  open(content?: HTMLElement) {
    if (content) {
      this.setContent(content);
    }
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}
