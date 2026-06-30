import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Page extends Component<any> {
    protected catalog: HTMLElement;
    protected basket: HTMLElement;
    protected counter: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.catalog = this.ensureElement('.gallery');
        this.basket = this.ensureElement('.header__basket');
        this.counter = this.ensureElement('.header__basket-counter');

        this.subscribe(this.basket, 'click', () => {
            this.emitEvent('page:basket');
        });
    }

    setCatalog(items: HTMLElement[]): void {
        this.catalog.replaceChildren(...items);
    }

    setCounter(count: number): void {
        this.setText(this.counter, String(count));
    }
}