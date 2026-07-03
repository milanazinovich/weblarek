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
import { API_URL } from './utils/constants';
import { IProduct, IBuyer, IOrderData, IOrderResult, TPayment } from './types';
import { cloneTemplate } from './utils/utils';

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
const events = new EventEmitter();
const api = new WebLarekAPI(API_URL);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const customerModel = new CustomerModel(events);

const page = new Page(document.body, events);
const headerBasket = new HeaderBasket(document.body, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const basket = new Basket(cloneTemplate('basket'), events);
const successModal = new SuccessModal(cloneTemplate('success'), events);

// ==================== ПЕРЕМЕННЫЕ СОСТОЯНИЯ ====================
let isBasketModalOpen = false;
let currentOpenProduct: IProduct | null = null;
let currentCardInstance: CardFull | null = null;

// ✅ ТЕКУЩИЕ ЭКЗЕМПЛЯРЫ ФОРМ
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

// ==================== КАТАЛОГ ====================
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

// ==================== КОРЗИНА ====================
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

// ✅ КНОПКА "ОФОРМИТЬ" В КОРЗИНЕ - СОЗДАЕМ ФОРМУ ЗАКАЗА
events.on('basket:submit', () => {
    // Создаем НОВЫЙ экземпляр формы заказа
    currentOrderForm = new OrderForm(cloneTemplate('order'), events);
    
    // Заполняем данными из модели (если есть)
    const orderData = customerModel.getOrderData();
    if (orderData.address) {
        currentOrderForm.address = orderData.address;
    }
    if (orderData.payment) {
        currentOrderForm.selectedPayment = orderData.payment;
    }
    
    // Показываем в модалке
    modal.render(currentOrderForm.getContainer());
});

// ==================== ФОРМА ЗАКАЗА ====================
// ==================== ФОРМА ЗАКАЗА ====================
events.on('order:change', (data: { field: keyof IBuyer; value: string }) => {
    console.log('📝 order:change получен:', data);
    
    // 1. Обновляем модель
    if (data.field === 'address') {
        customerModel.setAddress(data.value);
        console.log('  ✅ Адрес установлен:', data.value);
    } else if (data.field === 'payment') {
        customerModel.setPayment(data.value as TPayment);
        console.log('  ✅ Способ оплаты установлен:', data.value);
    }
    
    // 2. Валидируем
    const errors = customerModel.validateOrderStep();
    console.log('  🔍 Ошибки валидации:', errors);
    
    const errorText = Object.values(errors).join('; ');
    const isValid = Object.keys(errors).length === 0;
    
    console.log(`  📊 isValid: ${isValid}, errorText: "${errorText}"`);
    
    // 3. Обновляем UI формы
    if (currentOrderForm) {
        currentOrderForm.errorText = errorText;
        currentOrderForm.isValid = isValid;
        console.log('  ✅ Форма обновлена');
    } else {
        console.log('  ❌ currentOrderForm = null!');
    }
});

// ✅ КНОПКА "ДАЛЕЕ" В ФОРМЕ ЗАКАЗА
// main.ts - добавьте логи в начало обработчика
events.on('order:submit', () => {
    console.log('🎯🎯🎯 ORDER:SUBMIT ВЫЗВАН! 🎯🎯🎯');
    
    const errors = customerModel.validateOrderStep();
    console.log('  🔍 Ошибки при отправке:', errors);
    
    if (Object.keys(errors).length === 0) {
        console.log('  ✅ Форма валидна, создаем форму контактов');
        
        // Создаем НОВЫЙ экземпляр формы контактов
        currentContactsForm = new ContactsForm(cloneTemplate('contacts'), events);
        console.log('  ✅ currentContactsForm создан');
        
        // Заполняем данными из модели
        const orderData = customerModel.getOrderData();
        console.log('  📦 Данные заказа:', orderData);
        
        if (orderData.email) {
            currentContactsForm.email = orderData.email;
            console.log('  ✅ Email установлен:', orderData.email);
        }
        if (orderData.phone) {
            currentContactsForm.phone = orderData.phone;
            console.log('  ✅ Телефон установлен:', orderData.phone);
        }
        
        // Показываем в модалке
        console.log('  📌 Открываем модалку с формой контактов');
        modal.render(currentContactsForm.getContainer());
        console.log('  ✅ Модалка должна быть открыта');
    } else {
        console.log('  ❌ Форма невалидна:', errors);
    }
});

// ==================== ФОРМА КОНТАКТОВ ====================
events.on('contacts:change', (data: { field: keyof IBuyer; value: string }) => {
    // 1. Обновляем модель
    if (data.field === 'email') {
        customerModel.setEmail(data.value);
    } else if (data.field === 'phone') {
        customerModel.setPhone(data.value);
    }
    
    // 2. Валидируем
    const errors = customerModel.validateContactsStep();
    const errorText = Object.values(errors).join('; ');
    const isValid = Object.keys(errors).length === 0;
    
    // 3. Обновляем UI формы
    if (currentContactsForm) {
        currentContactsForm.errorText = errorText;
        currentContactsForm.isValid = isValid;
    }
});

// ✅ КНОПКА "ОПЛАТИТЬ" В ФОРМЕ КОНТАКТОВ
events.on('contacts:submit', () => {
    const errors = customerModel.validateContactsStep();

    if (Object.keys(errors).length === 0) {
        // Формируем данные для заказа
        const orderData: IOrderData = {
            payment: customerModel.getOrderData().payment!,
            email: customerModel.getOrderData().email,
            phone: customerModel.getOrderData().phone,
            address: customerModel.getOrderData().address,
            total: basketModel.getTotalPrice(),
            items: basketModel.getItems().map(item => item.id)
        };
        
        // Отправляем заказ
        api.createOrder(orderData)
            .then((result: IOrderResult) => {
                // Очищаем корзину и данные клиента
                basketModel.clear();
                customerModel.clear();
                
                // Показываем успех
                successModal.render({ total: result.total });
                modal.render(successModal.getContainer());
                
                // Обновляем счетчик в хедере
                headerBasket.setCounter(0);
                
                // Очищаем ссылки на формы
                currentOrderForm = null;
                currentContactsForm = null;
            })
            .catch((err) => {
                console.error('Ошибка при отправке заказа:', err);
                alert('Произошла ошибка при оформлении заказа. Попробуйте снова.');
            });
    } else {
        console.log('❌ Форма контактов невалидна:', errors);
        // Обновляем ошибки в UI
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

    currentCardInstance = new CardFull(cloneTemplate('card-preview'), events);
    
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