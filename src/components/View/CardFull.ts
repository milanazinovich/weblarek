import { FullCard } from './FullCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class CardFull extends FullCard {
    protected button!: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.button = this.ensureElement('.button');

        this.subscribe(this.button, 'click', () => {
            this.emitEvent('full:buy', { id: this.container.dataset.id });
        });
    }

    render(data: IProduct & { inBasket: boolean }): HTMLElement {
        super.render(data);
        this.container.dataset.id = data.id;

        if (data.inBasket) {
            this.setText(this.button, 'Удалить из корзины');
        } else {
            this.setText(this.button, 'Купить');
        }

        if (data.price === null) {
            this.setDisabled(this.button, true);
            this.setText(this.button, 'Недоступно');
        } else {
            this.setDisabled(this.button, false);
        }

        return this.container;
    }
}