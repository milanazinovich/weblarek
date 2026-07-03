import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

export abstract class Form extends Component<IBuyer> {
    protected submit!: HTMLButtonElement;
    protected errors!: HTMLElement;
    protected eventPrefix: string;

    constructor(container: HTMLElement, events: IEvents, eventPrefix: string) {
    super(container, events);
    
    this.eventPrefix = eventPrefix;
    this.eventPrefix = eventPrefix;
    this.errors = this.ensureElement('.form__errors');

    this.submit = 
        this.container.querySelector('.order__button') as HTMLButtonElement ||
        this.container.querySelector('button[type="submit"]') as HTMLButtonElement ||
        this.container.querySelectorAll('.button')[1] as HTMLButtonElement;

   this.subscribe(this.container, 'input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.tagName === 'BUTTON') return;
    
    if (target.name) {
        console.log(' Form.ts ЭМИТИТ СОБЫТИЕ:', {
            eventName: `${this.eventPrefix}:change`,
            field: target.name,
            value: target.value,
            eventsExists: !!this.events
        });

        this.emitEvent(`${this.eventPrefix}:change`, {
            field: target.name as keyof IBuyer,
            value: target.value
        });
    }
});
}

    valid(errors: Record<string, string>): boolean {
        const hasErrors = Object.keys(errors).length > 0;
        
        if (this.submit) {
            this.setDisabled(this.submit, hasErrors);
        }
        
        if (hasErrors) {
            this.setText(this.errors, Object.values(errors).join('; '));
        } else {
            this.setText(this.errors, '');
        }
        
        return !hasErrors;
    }

    render(data: Partial<IBuyer>): HTMLElement {
        Object.entries(data).forEach(([key, value]) => {
            const input = this.container.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (input && value !== undefined && input.tagName !== 'BUTTON') {
                input.value = String(value);
            }
        });
        
        return super.render(data);
    }
}