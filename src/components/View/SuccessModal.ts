import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement, setText, subscribe, emitEvent } from '../../utils/dom';

export interface ISuccessData {
    total: number;
}

export class SuccessModal extends Component<ISuccessData> {
    protected close: HTMLElement;
    protected total: HTMLElement;
    private events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        this.close = ensureElement(container, '.order-success__close');
        this.total = ensureElement(container, '.order-success__description');

        subscribe(this.close, 'click', () => {
            emitEvent(this.events, 'success:close');
        });
    }

    render(data: ISuccessData): HTMLElement {
        setText(this.total, `Списано ${data.total} синапсов`);
        return super.render(data);
    }

    public getContainer(): HTMLElement {
        return this.container;
    }
}