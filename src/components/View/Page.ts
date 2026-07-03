import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Page extends Component<any> {
    protected catalog: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.catalog = this.ensureElement('.gallery');
    }

    setCatalog(items: HTMLElement[]): void {
        this.catalog.replaceChildren(...items);
    }
}