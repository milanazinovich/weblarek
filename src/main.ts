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
import { Card } from './components/View/Card';
import { API_URL } from './utils/constants';
import { IProduct, IBuyer, IOrderData, IOrderResult, TPayment } from './types';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const api = new WebLarekAPI(API_URL);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const customerModel = new CustomerModel(events);
const card = new Card(cloneTemplate('card-catalog'), events, true);
const cardFull = new Card(cloneTemplate('card-preview'), events, false);
const page = new Page(document.body, events);
const headerBasket = new HeaderBasket(document.body, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const basket = new Basket(cloneTemplate('basket'), events);
const successModal = new SuccessModal(cloneTemplate('success'), events);

let isBasketModalOpen = false;
let currentOpenProduct: IProduct | null = null;
let currentCardInstance: Card | null = null;
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

events.on('catalog:changed', () => {
    const items = catalogModel.getItems();
    const cardElements = items.map((item) => {
        const card = new Card(cloneTemplate('card-catalog'), events, true);
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

events.on('basket:submit', () => {
    currentOrderForm = new OrderForm(cloneTemplate('order'), events);
    
    const orderData = customerModel.getOrderData();
    if (orderData.address) {
        currentOrderForm.address = orderData.address;
    }
    if (orderData.payment) {
        currentOrderForm.selectedPayment = orderData.payment;
    }
    
    modal.render(currentOrderForm.getContainer());
});

events.on('order:change', (data: { field: keyof IBuyer; value: string }) => {
    if (data.field === 'address') {
        customerModel.setAddress(data.value);
    } else if (data.field === 'payment') {
        customerModel.setPayment(data.value as TPayment);
    }
    
    const errors = customerModel.validateOrderStep();
    const errorText = Object.values(errors).join('; ');
    const isValid = Object.keys(errors).length === 0;
    
    if (currentOrderForm) {
        currentOrderForm.errorText = errorText;
        currentOrderForm.isValid = isValid;
    }
});

events.on('order:submit', () => {
    
    const errors = customerModel.validateOrderStep();
    
    if (Object.keys(errors).length === 0) {
        currentContactsForm = new ContactsForm(cloneTemplate('contacts'), events);
        
        const orderData = customerModel.getOrderData();
        
        if (orderData.email) {
            currentContactsForm.email = orderData.email;
        }
        if (orderData.phone) {
            currentContactsForm.phone = orderData.phone;
        }
        modal.render(currentContactsForm.getContainer());
    }
});

events.on('contacts:change', (data: { field: keyof IBuyer; value: string }) => {
    if (data.field === 'email') {
        customerModel.setEmail(data.value);
    } else if (data.field === 'phone') {
        customerModel.setPhone(data.value);
    }
    
    const errors = customerModel.validateContactsStep();
    const errorText = Object.values(errors).join('; ');
    const isValid = Object.keys(errors).length === 0;
    
    if (currentContactsForm) {
        currentContactsForm.errorText = errorText;
        currentContactsForm.isValid = isValid;
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
                
                headerBasket.setCounter(0);
                
                currentOrderForm = null;
                currentContactsForm = null;
            })
            .catch((err) => {
                console.error('Ошибка при отправке заказа:', err);
                alert('Произошла ошибка при оформлении заказа. Попробуйте снова.');
            });
    } else {
        if (currentContactsForm) {
            const errorText = Object.values(errors).join('; ');
            currentContactsForm.errorText = errorText;
            currentContactsForm.isValid = false;
        }
    }
});

// ==================== МОДАЛЬНОЕ ОКНО ====================
events.on('modal:close', () => {
    isBasketModalOpen = false;
});

events.on('success:close', () => {
    modal.close();
});

// ==================== ТОВАРЫ В МОДАЛКЕ ====================
events.on('product:selected', (data: { item: IProduct }) => {
    currentOpenProduct = catalogModel.getItemById(data.item.id) || data.item;
    
    let buttonText = 'Купить';
    let buttonDisabled = false;

    if (currentOpenProduct.price === null) {
        buttonText = 'Недоступно';
        buttonDisabled = true;
    } else if (basketModel.hasItem(currentOpenProduct.id)) {
        buttonText = 'Удалить';
    }

    currentCardInstance = new Card(cloneTemplate('card-preview'), events);
    
    currentCardInstance.render({
        ...currentOpenProduct,
        buttonText: buttonText,
        buttonDisabled: buttonDisabled
    });
    
    modal.render(currentCardInstance.getContainer());
});

events.on('card:buy', () => {
    if (!currentOpenProduct || !currentCardInstance) return;

    if (basketModel.hasItem(currentOpenProduct.id)) {
        basketModel.removeItem(currentOpenProduct.id);
    } else {
        basketModel.addItem(currentOpenProduct);
    }

    let buttonText = 'Купить';
    let buttonDisabled = false;

    if (currentOpenProduct.price === null) {
        buttonText = 'Недоступно';
        buttonDisabled = true;
    } else if (basketModel.hasItem(currentOpenProduct.id)) {
        buttonText = 'Удалить из корзины';
    }

    currentCardInstance.render({
        ...currentOpenProduct,
        buttonText: buttonText,
        buttonDisabled: buttonDisabled
    });
});

events.on('modal:close', () => {
    currentOpenProduct = null;
    currentCardInstance = null;
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

// ==================== ЗАГРУЗКА ДАННЫХ ====================
api.getProducts()
    .then((response: { items: IProduct[] }) => {
        catalogModel.setItems(response.items);
    })
    .catch((error) => {
        console.error('Ошибка загрузки товаров:', error);
        alert('Не удалось загрузить каталог товаров. Проверьте подключение к интернету.');
    });