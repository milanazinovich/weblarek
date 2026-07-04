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

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.container.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      this.onClick(e);
    });
  }

  render(data?: Partial<IProduct>): HTMLElement {
    super.render(data);

    if (!data) {
      return this.container;
    }

    if (data.category !== undefined) {
      this.categoryElement.textContent = data.category;
      this.categoryElement.classList.remove(...Object.values(categoryMap));

      const modifier = categoryMap[data.category as keyof typeof categoryMap];
      if (modifier) {
        this.categoryElement.classList.add(modifier);
      }
    }

    if (data.image !== undefined) {
      this.setImage(this.imageElement, CDN_URL + data.image, data.title);
    }

    return this.container;
  }
}
