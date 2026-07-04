import { ICatalog } from '../../types';
import { Component } from '../base/Component';

export class Catalog extends Component<ICatalog> {

    constructor(container: HTMLElement) {
        super(container);
    }

    set catalog(items: HTMLElement[]) {
            this.container.replaceChildren(...items);
    }
}