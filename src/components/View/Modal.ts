import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, subscribe, emitEvent } from '../../utils/dom';

export class Modal extends Component<any> {
    protected closeButton: HTMLElement;
    protected content: HTMLElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        this.closeButton = ensureElement(container, '.modal__close');
        this.content = ensureElement(container, '.modal__content');

        subscribe(this.closeButton, 'click', () => {
            this.close();
        });

        subscribe(this.container, 'click', (e: Event) => {
            if (e.target === this.container) {
                emitEvent(this.events, 'modal:close');
            }
        });
    }

    public open(): void {
        this.container.classList.add('modal_active');
    }

    public render(content: HTMLElement): HTMLElement {
        this.content.innerHTML = '';
        this.content.appendChild(content);
        this.open();
        return this.container;
    }

    public close(): void {
        this.container.classList.remove('modal_active');
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}