import { Api } from '../base/Api';
import { IProductListResponse, IOrderData, IOrderResult } from '../../types';

export class WebLarekAPI extends Api {
  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  getProducts() {
    return this.get<IProductListResponse>('/product');
  }

  createOrder(order: IOrderData) {
    return this.post<IOrderResult>('/order', order);
  }
}