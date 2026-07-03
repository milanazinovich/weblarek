// Page.ts
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/dom';

export class Page extends Component<any> {
    protected catalog: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.catalog = ensureElement<HTMLElement>(container, '.gallery');
    }

    setCatalog(items: HTMLElement[]): void {
        this.catalog.replaceChildren(...items);
    }

    getContainer(): HTMLElement {
        return this.container;
    }
}