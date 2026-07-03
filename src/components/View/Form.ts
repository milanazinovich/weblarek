import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBuyer } from '../../types';
import { subscribe, emitEvent, ensureElement, setText, setDisabled } from '../../utils/dom';

export abstract class Form extends Component<IBuyer> {
    protected submit: HTMLButtonElement;
    protected errors: HTMLElement;
    protected inputs: Map<string, HTMLInputElement> = new Map();
    protected formName: string;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents, formName: string) {
        super(container);
        this.events = events;
        this.formName = formName; 
        this.submit = ensureElement<HTMLButtonElement>(container, 'button[type="submit"]');
        this.errors = ensureElement<HTMLElement>(container, '.form__errors');
        this.cacheInputs();
        
        subscribe(container, 'input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.name) {
                emitEvent(this.events, `${this.formName}:change`, {
                    field: target.name as keyof IBuyer,
                    value: target.value
                });
            }
        });
    }

    private cacheInputs(): void {
        const allInputs = this.container.querySelectorAll('input');
        allInputs.forEach(input => {
            if (input.name) {
                this.inputs.set(input.name, input);
            }
        });
    }

    set address(value: string) {
        const input = this.inputs.get('address');
        if (input) {
            input.value = value;
        }
    }

    set email(value: string) {
        const input = this.inputs.get('email');
        if (input) {
            input.value = value;
        }
    }

    set phone(value: string) {
        const input = this.inputs.get('phone');
        if (input) {
            input.value = value;
        }
    }

    set payment(value: string) {
        const input = this.inputs.get('payment');
        if (input) {
            input.value = value;
        }
    }

    setField(name: string, value: string): void {
        const input = this.inputs.get(name);
        if (input) {
            input.value = value;
        }
    }

    set errorText(value: string) {
        setText(this.errors, value);
    }

    set isValid(value: boolean) {
        setDisabled(this.submit, !value);
        const isDisabled = this.submit.hasAttribute('disabled');
    }

    render(data: Partial<IBuyer>): HTMLElement {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) {
                    this.setField(key, String(value));
                }
            });
        }
        return super.render(data);
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}