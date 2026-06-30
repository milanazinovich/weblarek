import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

export class OrderForm extends Form {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.subscribe(this.container, 'change', (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.name === 'payment') {
                this.emitEvent('order:change', {
                    field: 'payment' as keyof IBuyer,
                    value: target.value
                });
            }
        });

        this.subscribe(this.submit, 'click', (e: Event) => {
            e.preventDefault();
            this.emitEvent('order:submit');
        });
    }

    render(data: Partial<IBuyer>): HTMLElement {
        super.render(data);
        
        const paymentInputs = this.container.querySelectorAll('[name="payment"]');
        paymentInputs.forEach((element) => {
            const input = element as HTMLInputElement;
            const label = input.closest('.button');
            if (label) {
                if (input.checked) {
                    label.classList.add('button_alt-active');
                } else {
                    label.classList.remove('button_alt-active');
                }
            }
        });

        return this.container;
    }
}