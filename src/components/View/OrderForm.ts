import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';
import { subscribe, emitEvent } from '../../utils/dom';

export class OrderForm extends Form {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events, 'order');
        
        this.paymentButtons = container.querySelectorAll('button[name="card"], button[name="cash"]');
        
        this.paymentButtons.forEach((button) => {
            subscribe(button, 'click', () => {
                this.paymentButtons.forEach(btn => {
                    btn.classList.remove('button_alt-active');
                });
                
                button.classList.add('button_alt-active');
                
                emitEvent(this.events, 'order:change', {
                    field: 'payment' as keyof IBuyer,
                    value: button.name
                });
            });
        });

        subscribe(container, 'submit', (e: Event) => {
            e.preventDefault();
            emitEvent(this.events, 'order:submit');
        });
    }

    render(data: Partial<IBuyer>): HTMLElement {
        super.render(data);
        
        this.paymentButtons = this.container.querySelectorAll('button[name="card"], button[name="cash"]');
        
        if (data?.payment) {
            this.paymentButtons.forEach(btn => {
                if (btn.name === data.payment) {
                    btn.classList.add('button_alt-active');
                } else {
                    btn.classList.remove('button_alt-active');
                }
            });
        }
        
        return this.container;
    }

    set selectedPayment(value: string) {
        this.paymentButtons.forEach(btn => {
            if (btn.name === value) {
                btn.classList.add('button_alt-active');
            } else {
                btn.classList.remove('button_alt-active');
            }
        });
    }

    set errorText(value: string) {
        super.errorText = value;
    }

    set isValid(value: boolean) {
        super.isValid = value;
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}