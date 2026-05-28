import { Api } from '../base/Api';
import { IProductListResponse, IOrderData, IOrderResult } from '../../types';
import { API_URL } from '../../utils/constants';

export class WebLarekAPI extends Api {
  constructor(options?: RequestInit) {
    super(API_URL, options);
  }

  getProducts() {
    return this.get<IProductListResponse>('/product');
  }

  createOrder(order: IOrderData) {
    return this.post<IOrderResult>('/order', order);
  }
}