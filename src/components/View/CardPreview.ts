import { FullCard } from './FullCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export class CardPreview extends FullCard {
    protected button!: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        this.button = this.container.querySelector('.button') as HTMLElement;
        
        if (!this.button) {
            this.button = document.createElement('button');
            this.button.className = 'button';
            this.container.appendChild(this.button);
        }

        this.subscribe(this.button, 'click', (e: Event) => {
            e.stopPropagation();
            this.emitEvent('preview:buy', { id: this.container.dataset.id });
        });
    }

    render(data: IProduct & { inBasket: boolean }): HTMLElement {
        super.render(data);
        this.container.dataset.id = data.id;

        if (data.inBasket) {
            this.setText(this.button, 'Удалить');
            this.container.classList.add('card__selected');
        } else {
            this.setText(this.button, 'Купить');
            this.container.classList.remove('card__selected');
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