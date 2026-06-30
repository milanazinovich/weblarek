import { BaseCard } from './BaseCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class CardBasket extends BaseCard {
    protected deleteButton: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.deleteButton = this.ensureElement('.card__button');

        this.subscribe(this.deleteButton, 'click', () => {
            this.emitEvent('basket:remove', { id: this.container.dataset.id });
        });
    }

    render(data: IProduct): HTMLElement {
        super.render(data);
        this.container.dataset.id = data.id;
        return this.container;
    }
}