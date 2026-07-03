import { Form } from './Form';
import { IEvents } from '../base/Events';
import { subscribe, emitEvent } from '../../utils/dom';

export class ContactsForm extends Form {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events, 'contacts');

        subscribe(container, 'submit', (e: Event) => {
            e.preventDefault();
            emitEvent(this.events, 'contacts:submit');
        });
    }

    // ✅ ЯВНО ОБЪЯВЛЯЕМ СЕТТЕРЫ, которые есть в родительском классе
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