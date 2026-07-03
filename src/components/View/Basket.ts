import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { CardBasket } from './CardBasket';
import { IProduct } from '../../types';
import { ensureElement, setText, setDisabled, subscribe, emitEvent } from '../../utils/dom';

export interface IBasketData {
    items: IProduct[];
    total: number;
}

export class Basket extends Component<IBasketData> {
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected submit: HTMLElement;
    private events: IEvents; // ← Храним события отдельно

    constructor(container: HTMLElement, events: IEvents) {
        super(container); // ← Только container, как в стартере
        this.events = events;

        // ✅ Передаём container первым аргументом
        this.list = ensureElement(container, '.basket__list');
        this.total = ensureElement(container, '.basket__price');
        this.submit = ensureElement(container, '.basket__button');

        // ✅ Вызываем subscribe без this.
        subscribe(this.submit, 'click', () => {
            // ✅ Передаём this.events первым аргументом
            emitEvent(this.events, 'basket:submit');
        });
    }

    render(data: IBasketData): HTMLElement {
        this.list.innerHTML = '';
        
        if (data.items.length === 0) {
            this.list.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
            // ✅ Вызываем setDisabled без this.
            setDisabled(this.submit, true);
        } else {
            data.items.forEach((item, index) => {
                const template = document.getElementById('card-basket') as HTMLTemplateElement;
                
                if (template) {
                    const cardContainer = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
                    const card = new CardBasket(cardContainer, this.events);
                    card.render({ ...item, index: index + 1 });
                    this.list.appendChild(card.getContainer());
                }
            });
            setDisabled(this.submit, false);
        }

        // ✅ Вызываем setText без this.
        setText(this.total, `${data.total} синапсов`);
        
        return super.render(data);
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}