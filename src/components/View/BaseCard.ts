import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { ensureElement, setText } from '../../utils/dom';

export abstract class BaseCard extends Component<IProduct> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.titleElement = ensureElement(container, '.card__title');
        this.priceElement = ensureElement(container, '.card__price');
    }

   set title(value: string) {
        setText(this.titleElement, value);
    }

    set price(value: number | null) {
        setText(this.priceElement, value ? `${value} синапсов` : 'Бесценно');
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}