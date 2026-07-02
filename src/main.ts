import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { CustomerModel } from './components/Models/CustomerModel';
import { WebLarekAPI } from './components/Models/WebLarekAPI';
import { Page } from './components/View/Page';
import { HeaderBasket } from './components/View/HeaderBasket';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { SuccessModal } from './components/View/SuccessModal';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { CardPreview } from './components/View/CardPreview';
import { CardFull } from './components/View/CardFull';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IBuyer, IOrderData, IOrderResult } from './types';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const api = new WebLarekAPI(API_URL);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const customerModel = new CustomerModel(events);

const page = new Page(document.body, events);
const headerBasket = new HeaderBasket(document.body, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const basket = new Basket(cloneTemplate('basket'), events);
const clonedForm = cloneTemplate('order');
const orderForm = new OrderForm(cloneTemplate('order'), events);
const contactsForm = new ContactsForm(cloneTemplate('contacts'), events);
const successModal = new SuccessModal(cloneTemplate('success'), events);

let isBasketModalOpen = false;

function renderContactsForm() {
    
    contactsForm.render({
        email: customerModel.getOrderData().email,
        phone: customerModel.getOrderData().phone
    });
    
    modal.render(contactsForm.getContainer());
}

events.on('catalog:changed', () => {
    const items = catalogModel.getItems();
    const cardElements = items.map((item) => {
        const card = new CardPreview(cloneTemplate('card-catalog'), events);
        card.render({
            ...item,
            inBasket: basketModel.hasItem(item.id)
        });
        return card.getContainer();
    });
    page.setCatalog(cardElements);
});

events.on('page:basket', () => {
    isBasketModalOpen = true;
    basket.render({
        items: basketModel.getItems(),
        total: basketModel.getTotalPrice()
    });
    modal.render(basket.getContainer());
});

events.on('basket:submit', () => {
    modal.render(orderForm.getContainer());
});

events.on('basket:remove', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

events.on('basket:change', () => {
    headerBasket.setCounter(basketModel.getTotalItems());
    
    if (isBasketModalOpen) {
        basket.render({
            items: basketModel.getItems(),
            total: basketModel.getTotalPrice()
        });
        modal.render(basket.getContainer());
    }
});

events.on('order:change', (data: { field: keyof IBuyer; value: string }) => {
    if (data.field === 'payment') {
        customerModel.setPayment(data.value as 'card' | 'cash');
    }
    if (data.field === 'address') {
        customerModel.setAddress(data.value);
    }
    
    const errors = customerModel.validateOrderStep();
    console.log('Ошибки валидации:', errors);
    
    orderForm.valid({ 
        ...(errors.payment && { payment: errors.payment }),
        ...(errors.address && { address: errors.address })
    });
});

events.on('contacts:change', (data: { field: keyof IBuyer; value: string }) => {
    
    if (data.field === 'email') customerModel.setEmail(data.value);
    if (data.field === 'phone') customerModel.setPhone(data.value);
    
    const errors = customerModel.validateContactsStep();
    contactsForm.valid(Object.keys(errors).length > 0 ? errors : {});
});

events.on('order:submit', () => {
    
    const errors = customerModel.validateOrderStep();
    
    if (Object.keys(errors).length === 0) {
        renderContactsForm();
    } else {
        orderForm.valid(errors);
    }
});

events.on('contacts:submit', () => {
    
    const errors = customerModel.validateContactsStep();

    if (Object.keys(errors).length === 0) {
        const orderData: IOrderData = {
            payment: customerModel.getOrderData().payment!,
            email: customerModel.getOrderData().email,
            phone: customerModel.getOrderData().phone,
            address: customerModel.getOrderData().address,
            total: basketModel.getTotalPrice(),
            items: basketModel.getItems().map(item => item.id)
        };
        

    api.createOrder(orderData)
        .then((result: IOrderResult) => {
            basketModel.clear();
            customerModel.clear();
            successModal.render({ total: result.total });
            modal.render(successModal.getContainer());
        })
        .catch((err) => {
            console.error('Ошибка при отправке заказа:', err);
            alert('Произошла ошибка при оформлении заказа. Попробуйте снова.');
        });
        } else {
        console.log(' Есть ошибки, блокируем кнопку');
        contactsForm.valid(errors);
    }
});

events.on('modal:close', () => {
    isBasketModalOpen = false;
});

events.on('success:close', () => {
    modal.close();
});

events.on('product:selected', (data: { item: IProduct }) => {
    const card = new CardFull(cloneTemplate('card-preview'), events);
    card.render({
        ...data.item,
        inBasket: basketModel.hasItem(data.item.id)
    });
    modal.render(card.getContainer());
});

events.on('preview:buy', (data: { id: string }) => {
    const product = catalogModel.getItemById(data.id);
    if (product) {
        if (basketModel.hasItem(data.id)) {
            basketModel.removeItem(data.id);
        } else {
            basketModel.addItem(product);
        }
    }
});

events.on('full:buy', (data: { id: string }) => {
    const product = catalogModel.getItemById(data.id);
    if (product) {
        if (basketModel.hasItem(data.id)) {
            basketModel.removeItem(data.id);
        } else {
            basketModel.addItem(product);
        }
        modal.close();
    }
});

api.getProducts()
    .then((response: { items: IProduct[] }) => {
        catalogModel.setItems(response.items);
    })
    .catch((error) => {
        console.error('Ошибка загрузки товаров:', error);
        alert('Не удалось загрузить каталог товаров. Проверьте подключение к интернету.');
    });

    