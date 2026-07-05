import { BaseCard } from "./BaseCard";
import { IEvents } from "../base/Events";
import { categoryMap, CDN_URL } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";

export class CatalogCard extends BaseCard<IProduct> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(
    container: HTMLElement,
    events: IEvents,
    private onClick: (e: Event) => void,
  ) {
    super(container, events);

    this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
    this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);

    this.container.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      this.onClick(e);
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.classList.remove(...Object.values(categoryMap));

    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.categoryElement.classList.add(modifier);
    }
  }

  set image(value: string) {
    if (value) {
      this.imageElement.src = CDN_URL + value;
      this.imageElement.alt = this.titleElement?.textContent || '';
    }
  }
}