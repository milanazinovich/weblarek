import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class CatalogModel {
  private _items: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit("catalog:changed");
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItemById(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
    this.events.emit("product:selected");
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}
