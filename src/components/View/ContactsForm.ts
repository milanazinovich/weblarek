import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form {
    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.subscribe(this.submit, 'click', (e: Event) => {
            e.preventDefault();
            this.emitEvent('contacts:submit');
        });
    }
}