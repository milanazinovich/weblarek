import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, setText, subscribe, emitEvent } from '../../utils/dom';

export class HeaderBasket extends Component<any> {
    protected basket: HTMLElement;
    protected counter: HTMLElement;
    private events: IEvents; // ← Храним события отдельно

    constructor(container: HTMLElement, events: IEvents) {
        super(container); // ← Только container, как в стартере
        this.events = events;

        // ✅ Вызываем утилиты с передачей container/element первым аргументом
        this.basket = ensureElement(container, '.header__basket');
        this.counter = ensureElement(container, '.header__basket-counter');

        // ✅ Вызываем subscribe без this.
        subscribe(this.basket, 'click', () => {
            console.log('🛒 Клик по корзине в хедере');
            // ✅ Передаём this.events первым аргументом
            emitEvent(this.events, 'page:basket');
        });
    }

    setCounter(count: number): void {
        // ✅ Вызываем setText без this.
        setText(this.counter, String(count));
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}