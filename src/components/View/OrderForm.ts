import { Form } from './Form';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

export class OrderForm extends Form {
    protected paymentButtons: NodeListOf<HTMLButtonElement>;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events, 'order');
        
        this.paymentButtons = this.container.querySelectorAll('button[name="card"], button[name="cash"]');
        
        this.paymentButtons.forEach((button, index) => {
            console.log(`Кнопка ${index}:`, {
                name: button.name,
                text: button.textContent?.trim()
            });
            
            this.subscribe(button, 'click', () => {
                
                this.paymentButtons.forEach(btn => {
                    btn.classList.remove('button_alt-active');
                });
                
                button.classList.add('button_alt-active');
                
                this.emitEvent('order:change', {
                    field: 'payment' as keyof IBuyer,
                    value: button.name // 'card' или 'cash'
                });
            });
        });

        this.subscribe(this.submit, 'click', (e: Event) => {
            e.preventDefault();
            this.emitEvent('order:submit');
        });
    }

    render(data: Partial<IBuyer>): HTMLElement {
        super.render(data);
        this.paymentButtons = this.container.querySelectorAll('button[name="card"], button[name="cash"]');
        
        this.paymentButtons.forEach(btn => {
            if (btn.name === data.payment) {
                btn.classList.add('button_alt-active');
                console.log('✅ Активировал кнопку:', btn.name);
            } else {
                btn.classList.remove('button_alt-active');
            }
        });
        
        return this.container;
    }
}