import { IProduct } from '../../types';

export class CatalogModel {
  private _items: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  constructor() {}

  setItems(items: IProduct[]): void {
    this._items = items;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItemById(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this._selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}