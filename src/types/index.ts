export type TPayment = 'card' | 'online';

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderData extends IBuyer {
  total: number;
  items: string[];
}

export type ValidationErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderResult {
  id: string;
  total: number;
}