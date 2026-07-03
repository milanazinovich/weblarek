import { BaseCard } from './BaseCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { setText, setImage, toggleClass } from '../../utils/dom';

export abstract class FullCard extends BaseCard {
    protected descriptionElement: HTMLElement | null;
    protected imageElement: HTMLImageElement | null;
    protected categoryElement: HTMLElement | null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events); 

        this.descriptionElement = this.container.querySelector('.card__text');
        this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement | null;
        this.categoryElement = this.container.querySelector('.card__category');
    }

    set description(value: string) {
        setText(this.descriptionElement, value);
    }

    set image(value: string) {
        if (this.imageElement && value) {
            setImage(this.imageElement, `${CDN_URL}/${value}`, value);
        }
    }

    set category(value: string) {
        if (this.categoryElement && value) {
            const categoryKey = value as keyof typeof categoryMap;
            const categoryClass = categoryMap[categoryKey] || 'card__category_other';
            this.categoryElement.className = `card__category ${categoryClass}`;
        }
    }
}