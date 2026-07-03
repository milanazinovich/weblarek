import { FullCard } from './FullCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { setText, setDisabled, subscribe, emitEvent } from '../../utils/dom';

export class CardFull extends FullCard {
    protected button!: HTMLElement;
    // ❌ НЕ ОБЪЯВЛЯЙТЕ events ЗДЕСЬ — он уже есть в BaseCard!

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events); // ← events передаётся в FullCard → BaseCard
        
        this.button = this.container.querySelector('.button') as HTMLElement;

        subscribe(this.button, 'click', () => {
            console.log('🔘 CardFull: кнопка нажата');
            // ✅ Используем this.events (унаследован из BaseCard)
            emitEvent(this.events, 'card:buy');
        });
    }

    set buttonText(value: string) {
        setText(this.button, value);
    }

    set buttonDisabled(state: boolean) {
        setDisabled(this.button, state);
    }

    render(data: IProduct & { buttonText: string; buttonDisabled: boolean }): HTMLElement {
        super.render(data);
        this.buttonText = data.buttonText;
        this.buttonDisabled = data.buttonDisabled;
        return this.container;
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}