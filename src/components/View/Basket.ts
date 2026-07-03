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
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.list = ensureElement(container, '.basket__list');
        this.total = ensureElement(container, '.basket__price');
        this.submit = ensureElement(container, '.basket__button');

        subscribe(this.submit, 'click', () => {
            emitEvent(this.events, 'basket:submit');
        });
    }

    render(data: IBasketData): HTMLElement {
        this.list.innerHTML = '';
        if (data.items.length === 0) {
            this.list.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
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

        setText(this.total, `${data.total} синапсов`);
        return super.render(data);
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}