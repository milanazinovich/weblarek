import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, subscribe, emitEvent } from '../../utils/dom';

export class Modal extends Component<any> {
    protected closeButton: HTMLElement;
    protected content: HTMLElement;
    private events: IEvents; // ← Храним события отдельно

    constructor(container: HTMLElement, events: IEvents) {
        super(container); // ← Только container, как в стартере
        this.events = events;

        // ✅ Вызываем утилиты с передачей container первым аргументом
        this.closeButton = ensureElement(container, '.modal__close');
        this.content = ensureElement(container, '.modal__content');

        // ✅ Вызываем subscribe без this.
        subscribe(this.closeButton, 'click', () => {
            this.close();
        });

        subscribe(this.container, 'click', (e: Event) => {
            if (e.target === this.container) {
                // ✅ Передаём this.events первым аргументом
                emitEvent(this.events, 'modal:close');
            }
        });
    }

    public open(): void {
        this.container.classList.add('modal_active');
        document.body.style.overflow = 'hidden';
        emitEvent(this.events, 'modal:open');
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
        emitEvent(this.events, 'modal:close');
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}