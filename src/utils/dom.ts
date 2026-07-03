/**
 * DOM-утилиты. Чистые функции, не зависящие от классов.
 */

/** Найти элемент внутри контейнера */
export function ensureElement<T extends HTMLElement>(container: HTMLElement, selector: string): T {
    const element = container.querySelector(selector) as T;
    if (!element) throw new Error(`Элемент ${selector} не найден`);
    return element;
}

/** Установить текст элемента */
export function setText(element: HTMLElement | null, value: unknown): void {
    if (element instanceof HTMLElement) {
        element.textContent = String(value);
    }
}

/** Установить изображение */
export function setImage(element: HTMLImageElement | null, src: string, alt?: string): void {
    if (element instanceof HTMLImageElement) {
        element.src = src;
        if (alt) element.alt = alt;
    }
}

/** Блокировать/разблокировать элемент */
export function setDisabled(element: HTMLElement | null, state: boolean): void {
    if (element instanceof HTMLElement) {
        element.toggleAttribute('disabled', state);
    }
}

/** Скрыть/показать элемент */
export function setHidden(element: HTMLElement | null, state: boolean): void {
    if (element instanceof HTMLElement) {
        element.classList.toggle('hidden', state);
    }
}

/** Переключить класс */
export function toggleClass(element: HTMLElement | null, className: string, force?: boolean): void {
    if (element instanceof HTMLElement) {
        element.classList.toggle(className, force);
    }
}

/** Подписаться на событие */
export function subscribe<T extends HTMLElement>(
    element: T,
    event: string,
    handler: (e: Event) => void
): void {
    element.addEventListener(event, handler);
}

/** Эмитить событие (используем inline-тип вместо IEvents) */
export function emitEvent(
    events: { emit: (event: string, data?: object) => void } | undefined, 
    event: string, 
    data?: unknown
): void {
    if (events) {
        events.emit(event, data as object | undefined);
    }
}