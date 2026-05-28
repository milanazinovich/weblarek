import './scss/styles.scss';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { CustomerModel } from './components/Models/CustomerModel';
import { apiProducts } from './utils/data';

const catalog = new CatalogModel();
console.log('CatalogModel - initial state:', catalog.getItems());

catalog.setItems(apiProducts.items);
console.log('CatalogModel - after setItems, length:', catalog.getItems().length);

const firstProduct = catalog.getItems()[0];
console.log('CatalogModel - find by ID:', catalog.getItemById(firstProduct.id));

catalog.setSelectedProduct(firstProduct);
console.log('CatalogModel - selected product title:', catalog.getSelectedProduct()?.title);

const basket = new BasketModel();
console.log('BasketModel - initial state:', basket.getItems());

basket.addItem(firstProduct);
basket.addItem(firstProduct);
console.log('BasketModel - after adding items, count:', basket.getTotalItems());
console.log('BasketModel - total price:', basket.getTotalPrice());
console.log('BasketModel - has item:', basket.hasItem(firstProduct.id));

basket.removeItem(firstProduct.id);
console.log('BasketModel - after remove, count:', basket.getTotalItems());

basket.clear();
console.log('BasketModel - after clear, count:', basket.getTotalItems());

const customer = new CustomerModel();
console.log('CustomerModel - validate empty:', customer.validate());

customer.setEmail('student@example.com');
customer.setPhone('+79991234567');
console.log('CustomerModel - validate partial:', customer.validate());

customer.setAddress('Москва, ул. Тестовая, 1');
customer.setPayment('online');
console.log('CustomerModel - validate full:', customer.validate());
console.log('CustomerModel - order data:', customer.getOrderData());

customer.clear();
console.log('CustomerModel - after clear done');

import { WebLarekAPI } from './components/Models/WebLarekAPI';

const api = new WebLarekAPI();

api.getProducts()
  .then((response) => {
    console.log('Полный ответ сервера:', response);
    
    catalog.setItems(response.items);
    console.log('Каталог обновлён. Загружено товаров:', catalog.getItems().length);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });