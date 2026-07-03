import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class HeaderBasket extends Component<any> {
    protected basket: HTMLElement;
    protected counter: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.basket = this.ensureElement('.header__basket');
        this.counter = this.ensureElement('.header__basket-counter');

        this.subscribe(this.basket, 'click', () => {
    console.log('🛒 Клик по корзине в хедере');
    this.emitEvent('page:basket');
});
    }

    setCounter(count: number): void {
        this.setText(this.counter, String(count));
    }
}