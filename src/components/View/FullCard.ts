import { BaseCard } from './BaseCard';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';
import { categoryMap, CDN_URL } from '../../utils/constants'; // Импортируем CDN_URL

export abstract class FullCard extends BaseCard {
    protected description: HTMLElement | null;
    protected image: HTMLImageElement | null;
    protected category: HTMLElement | null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.description = this.container.querySelector('.card__text');
        this.image = this.container.querySelector('.card__image') as HTMLImageElement | null;
        this.category = this.container.querySelector('.card__category');
    }

    render(data: IProduct): HTMLElement {
        super.render(data);
        
        if (this.description && data.description) {
            this.setText(this.description, data.description);
        }

        if (this.image && data.image) {
            const imageUrl = `${CDN_URL}/${data.image}`;
            this.setImage(this.image, imageUrl, data.title);
        }

        if (this.category && data.category) {
            const categoryKey = data.category as keyof typeof categoryMap;
            const categoryClass = categoryMap[categoryKey] || 'card__category_other';
            this.category.className = `card__category ${categoryClass}`;
        }

        return this.container;
    }
}