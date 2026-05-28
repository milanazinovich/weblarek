import { IBuyer, TPayment } from '../../types';

export class CustomerModel {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor() {}

  setPayment(payment: TPayment): void { this.payment = payment; }
  setEmail(email: string): void { this.email = email; }
  setPhone(phone: string): void { this.phone = phone; }
  setAddress(address: string): void { this.address = address; }

  getOrderData(): IBuyer {
    if (!this.payment) throw new Error('Payment not selected');
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.email) errors.email = 'Укажите емэйл';
    if (!this.phone) errors.phone = 'Укажите телефон';
    if (!this.address) errors.address = 'Укажите адрес';
    return errors;
  }
}