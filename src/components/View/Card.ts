// Card.ts
import { FullCard } from './FullCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { setText, setDisabled, subscribe, emitEvent, toggleClass } from '../../utils/dom';

export class Card extends FullCard {
    protected button: HTMLElement | null = null;
    protected isPreview: boolean;

    constructor(container: HTMLElement, events: IEvents, isPreview: boolean = false) {
        super(container, events);
        this.isPreview = isPreview;
        
        if (!this.isPreview) {
            this.button = this.container.querySelector('.button') as HTMLElement;
            
            if (this.button) {
                subscribe(this.button, 'click', (e: Event) => {
                    e.stopPropagation();
                    emitEvent(this.events, 'card:buy', { id: this.container.dataset.id });
                });
            }
        }

        subscribe(this.container, 'click', (e: Event) => {
            const target = e.target as HTMLElement;
            
            if (this.button && target.closest('.button')) {
                return;
            }
            
            if (this.isPreview) {
                emitEvent(this.events, 'product:selected', { 
                    item: { id: this.container.dataset.id } as IProduct 
                });
            }
        });
    }

    set buttonText(value: string) {
        if (this.button) {
            setText(this.button, value);
        }
    }

    set buttonDisabled(state: boolean) {
        if (this.button) {
            setDisabled(this.button, state);
        }
    }

    render(data: IProduct & { 
        inBasket?: boolean; 
        buttonText?: string; 
        buttonDisabled?: boolean 
    }): HTMLElement {
        this.container.dataset.id = data.id;
        this.title = data.title;
        this.price = data.price;
        this.description = data.description || '';
        this.image = data.image || '';
        this.category = data.category || '';
        
        if (this.isPreview) {
            toggleClass(this.container, 'card__selected', !!data.inBasket);
            this.container.style.cursor = 'pointer';
        } else {
            if (this.button) {
                this.buttonText = data.buttonText || 'Купить';
                const isDisabled = data.price === null || data.price === undefined || data.buttonDisabled === true;
                this.buttonDisabled = isDisabled;
            }
        }
        return this.container;
    }

    updateButton(text: string, disabled: boolean): void {
        if (!this.isPreview && this.button) {
            this.buttonText = text;
            this.buttonDisabled = disabled;
        }
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}