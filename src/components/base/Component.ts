import { IEvents } from './Events';

/**
 * Базовый компонент
 */
export abstract class Component<T> {
	protected constructor(
		protected readonly container: HTMLElement,
		protected readonly events?: IEvents
	) {}

	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) element.alt = alt;
		}
	}

	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
            element.textContent = String(value);
        }
	}

	// Найти элемент внутри контейнера
	protected ensureElement<ElementType extends HTMLElement>(selector: string): ElementType {
		const element = this.container.querySelector(selector) as ElementType;
		if (!element) throw new Error(`Элемент ${selector} не найден`);
		return element;
	}

	protected setDisabled(element: HTMLElement, state: boolean) {
		if (element) element.toggleAttribute('disabled', state);
	}

	protected setHidden(element: HTMLElement, state: boolean) {
		if (element) element.classList.toggle('hidden', state);
	}

	protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
		if (element) element.classList.toggle(className, force);
	}

	protected subscribe<ElementType extends HTMLElement>(
		element: ElementType,
		event: string,
		handler: (e: Event) => void
	) {
		element.addEventListener(event, handler);
	}

	protected emitEvent(event: string, data?: unknown) {
	if (this.events) this.events.emit(event, data as object | undefined);
}

render(data?: Partial<T>): HTMLElement {
	return this.container;
}
	public getContainer(): HTMLElement {
		return this.container;
	}
}