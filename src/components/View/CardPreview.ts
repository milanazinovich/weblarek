import { FullCard } from './FullCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { setText, toggleClass, subscribe, emitEvent } from '../../utils/dom';

export class CardPreview extends FullCard {
    // ❌ УБЕРИТЕ: protected button!: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        
        // ✅ ВСЯ КАРТОЧКА КЛИКАБЕЛЬНА — открываем модалку
        subscribe(this.container, 'click', (e: Event) => {
            e.stopPropagation();
            emitEvent(this.events, 'product:selected', { 
                item: { id: this.container.dataset.id } as IProduct 
            });
        });
    }

    render(data: IProduct & { inBasket: boolean }): HTMLElement {
        super.render(data);
        
        this.container.dataset.id = data.id;

        // ✅ Добавляем/убираем класс для визуального выделения
        if (data.inBasket) {
            this.container.classList.add('card__selected');
        } else {
            this.container.classList.remove('card__selected');
        }

        return this.container;
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}