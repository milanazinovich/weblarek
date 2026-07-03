import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, setText, subscribe, emitEvent } from '../../utils/dom';

export class HeaderBasket extends Component<any> {
    protected basket: HTMLElement;
    protected counter: HTMLElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.basket = ensureElement<HTMLElement>(container, '.header__basket');
        this.counter = ensureElement<HTMLElement>(container, '.header__basket-counter');

        subscribe(this.basket, 'click', () => {
            emitEvent(this.events, 'page:basket');
        });
    }

    setCounter(count: number): void {
        setText(this.counter, String(count));
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}