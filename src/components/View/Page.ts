import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/dom';

export class Page extends Component<any> {
    protected catalog: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container); // ← Только container, как в стартере
        
        // ✅ Вызываем ensureElement с передачей container первым аргументом
        this.catalog = ensureElement(container, '.gallery');
        
        // events не используется в этом классе, но параметр оставлен для совместимости с main.ts
    }

    setCatalog(items: HTMLElement[]): void {
        this.catalog.replaceChildren(...items);
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}