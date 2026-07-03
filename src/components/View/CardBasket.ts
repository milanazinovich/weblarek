import { BaseCard } from './BaseCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { subscribe, emitEvent, setText } from '../../utils/dom';

interface IBasketItemData extends IProduct {
    index?: number;
}

export class CardBasket extends BaseCard {
    protected deleteButton: HTMLElement | null;
    protected indexElement: HTMLElement | null;
    private _id: string = '';

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events); // ← BaseCard тоже принимает events!
        
        this.deleteButton = this.container.querySelector('.basket__item-delete');
        this.indexElement = this.container.querySelector('.basket__item-index');

        console.log('🔍 Кнопка удаления найдена:', this.deleteButton);

        if (this.deleteButton) {
            subscribe(this.deleteButton, 'click', (e) => {
                e.stopPropagation();
                console.log('🗑️ Клик по удалению. ID:', this._id);
                if (this._id) {
                    emitEvent(this.events, 'basket:remove', { id: this._id });
                }
            });
        } else {
            console.warn('⚠️ Кнопка удаления НЕ найдена! Проверьте селектор .basket__item-delete');
        }
    }

    set index(value: number) {
        setText(this.indexElement, String(value));
    }

    render(data: IBasketItemData): HTMLElement {
        super.render(data);
        
        this._id = data.id;
        
        if (data.index !== undefined) {
            this.index = data.index;
        }
        
        return this.container;
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}