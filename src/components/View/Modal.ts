import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<any> {
    protected closeButton: HTMLElement;
    protected content: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.closeButton = this.ensureElement('.modal__close');
        this.content = this.ensureElement('.modal__content');

        this.subscribe(this.closeButton, 'click', () => {
            this.emitEvent('modal:close');
        });

        this.subscribe(this.container, 'click', (e: Event) => {
            if (e.target === this.container) {
                this.emitEvent('modal:close');
            }
        });
    }

    public open(): void {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
        this.emitEvent('modal:open');
    }

    public render(content: HTMLElement): HTMLElement {
        this.content.innerHTML = '';
        this.content.appendChild(content);
        this.open();
        return this.container;
    }

    public close(): void {
        this.container.classList.remove('modal_active');
        document.body.style.overflow = '';
        this.emitEvent('modal:close');
    }
}