import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { CardBasket } from './CardBasket';
import { IProduct } from '../../types';

export interface IBasketData {
    items: IProduct[];
    total: number;
}

export class Basket extends Component<IBasketData> {
    protected list: HTMLElement;
    protected total: HTMLElement;
    protected submit: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.list = this.ensureElement('.basket__list');
        this.total = this.ensureElement('.basket__price');
        this.submit = this.ensureElement('.basket__button');

        this.subscribe(this.submit, 'click', () => {
            this.emitEvent('basket:submit');
        });
    }

    render(data: IBasketData): HTMLElement {
        this.list.innerHTML = '';
        
        if (data.items.length === 0) {
            this.list.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
            this.setDisabled(this.submit, true);
        } else {
            data.items.forEach((item, index) => {
                // Находим шаблон в документе
                const template = document.getElementById('card-basket') as HTMLTemplateElement;
                
                if (template) {
                    const cardContainer = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
                    
                    const card = new CardBasket(cardContainer, this.events!);
                    
                    card.render({ ...item, index: index + 1 });
                    
                    this.list.appendChild(card.getContainer());
                }
            });
            this.setDisabled(this.submit, false);
        }

        this.setText(this.total, `${data.total} синапсов`);
        
        return super.render(data);
    }
}