import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';

export abstract class Form extends Component<IBuyer> {
    protected submit: HTMLButtonElement;
    protected errors: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.submit = this.ensureElement('.button') as HTMLButtonElement;
        this.errors = this.ensureElement('.form__errors');

        this.subscribe(this.container, 'input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.name) {
                this.emitEvent(`${this.constructor.name.toLowerCase()}:change`, {
                    field: target.name as keyof IBuyer,
                    value: target.value
                });
            }
        });
    }

    valid(errors: Record<string, string>): boolean {
        const hasErrors = Object.keys(errors).length > 0;
        this.setDisabled(this.submit, hasErrors);
        
        if (hasErrors) {
            const errorText = Object.values(errors).join('; ');
            this.setText(this.errors, errorText);
        } else {
            this.setText(this.errors, '');
        }

        return !hasErrors;
    }

    render(data: Partial<IBuyer>): HTMLElement {
        Object.entries(data).forEach(([key, value]) => {
            const input = this.container.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (input && value !== undefined) {
                input.value = String(value);
            }
        });
        return super.render(data);
    }
}