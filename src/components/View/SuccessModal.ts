import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface ISuccessData {
    total: number;
}

export class SuccessModal extends Component<ISuccessData> {
    protected close: HTMLElement;
    protected total: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.close = this.ensureElement('.order-success__close');
        this.total = this.ensureElement('.order-success__description');

        this.subscribe(this.close, 'click', () => {
            this.emitEvent('success:close');
        });
    }

    render(data: ISuccessData): HTMLElement {
        this.setText(this.total, `Списано ${data.total} синапсов`);
        return super.render(data);
    }
}