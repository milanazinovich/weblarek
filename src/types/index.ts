export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    inCart?: boolean;
    index?: number;
    buttonText: string;
    buttonDisabled: boolean;
}

export interface ISuccess {
    total: number;
}

export interface ICatalog {
    items: HTMLElement[];
}

export interface IBaseCard {
    title: string;
    price: number | null;
}

export interface IBasketItem extends IBaseCard {
    index: number;
    id: string;
    title: string;
    price: number | null;
}

export interface IBasketData {
    items: HTMLElement[];
    total: number;
}

export interface IOrderForm {
    payment: TPayment | undefined;
    address: string;
}

export interface IBuyer {
    payment: TPayment | null;
    email: string;
    phone: string;
    address: string;
}

export type TPayment = 'card' | 'cash';

export interface IOrderData extends IBuyer {
    total: number;
    items: string[];
}

export interface IContact {
    email: string;
    phone: string;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

export type ValidationErrors = Record<string, string>;