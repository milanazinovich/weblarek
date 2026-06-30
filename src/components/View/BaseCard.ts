import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export abstract class BaseCard extends Component<IProduct> {
    protected title: HTMLElement;
    protected price: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.title = this.ensureElement('.card__title');
        this.price = this.ensureElement('.card__price');
    }

    render(data: IProduct): HTMLElement {
        this.setText(this.title, data.title);
        
        if (data.price !== null) {
            this.setText(this.price, `${data.price} синапсов`);
        } else {
            this.setText(this.price, 'Бесценно');
        }

        return super.render(data);
    }
}