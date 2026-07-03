import { BaseCard } from './BaseCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

interface IBasketItemData extends IProduct {
    index?: number;
}

export class CardBasket extends BaseCard {
    protected deleteButton: HTMLElement | null; // Может быть null
    protected indexElement: HTMLElement | null;
    private _id: string = '';

    constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    
    this.deleteButton = this.container.querySelector('.basket__item-delete');
    this.indexElement = this.container.querySelector('.basket__item-index');

    console.log('🔍 Кнопка удаления найдена:', this.deleteButton);

    if (this.deleteButton) {
        this.subscribe(this.deleteButton, 'click', () => {
            console.log('🗑️ Клик по удалению. ID:', this._id);
            if (this._id) {
                this.emitEvent('basket:remove', { id: this._id });
            }
        });
    } else {
        console.warn('⚠️ Кнопка удаления НЕ найдена! Проверьте селектор .basket__item-delete');
    }
}

    set index(value: number) {
        if (this.indexElement) {
            this.setText(this.indexElement, String(value));
        }
    }

    render(data: IBasketItemData): HTMLElement {
        super.render(data);
        
        this._id = data.id;
        
        if (data.index !== undefined) {
            this.index = data.index;
        }
        
        return this.container;
    }
}