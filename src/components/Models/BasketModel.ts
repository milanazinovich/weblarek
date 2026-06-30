import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class BasketModel {
	private _items: IProduct[] = [];
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	getItems(): IProduct[] {
		return this._items;
	}

	addItem(product: IProduct): void {
		this._items.push(product);
		this.events.emit('basket:change');
	}

	removeItem(id: string): void {
		this._items = this._items.filter(item => item.id !== id);
		this.events.emit('basket:change');
	}

	clear(): void {
		this._items = [];
		this.events.emit('basket:change');
	}

	getTotalPrice(): number {
		return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
	}

	getTotalItems(): number {
		return this._items.length;
	}

	hasItem(id: string): boolean {
		return this._items.some(item => item.id === id);
	}
}