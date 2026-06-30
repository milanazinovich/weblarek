import './scss/styles.scss';
import './scss/_variables.scss';
import './scss/mixins/_background.scss';
import './scss/mixins/_container.scss';
import './scss/mixins/_fix.scss';
import './scss/mixins/_icon.scss';
import './scss/mixins/_index.scss';
import './scss/mixins/_interactive.scss';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/Models/CatalogModel';
import { BasketModel } from './components/Models/BasketModel';
import { CustomerModel } from './components/Models/CustomerModel';
import { WebLarekAPI } from './components/Models/WebLarekAPI';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CardPreview } from './components/View/CardPreview';
import { CardFull } from './components/View/CardFull';
import { CardBasket } from './components/View/CardBasket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { API_URL } from './utils/constants';
import { IProduct } from './types';

const events = new EventEmitter();
const api = new WebLarekAPI(API_URL);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const customerModel = new CustomerModel(events);

const page = new Page(document.body, events);
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const modal = new Modal(modalContainer, events);

const cardCatalogTemplate = document.querySelector('#card-catalog')?.innerHTML || '';
const cardPreviewTemplate = document.querySelector('#card-preview')?.innerHTML || '';
const cardBasketTemplate = document.querySelector('#card-basket')?.innerHTML || '';
const basketTemplate = document.querySelector('#basket')?.innerHTML || '';
const orderFormTemplate = document.querySelector('#order')?.innerHTML || '';
const contactsFormTemplate = document.querySelector('#contacts')?.innerHTML || '';
const successTemplate = document.querySelector('#success')?.innerHTML || '';

let currentStep: 'order' | 'contacts' = 'order';
let orderFormInstance: OrderForm | null = null;
let contactsFormInstance: ContactsForm | null = null;

function createElementFromHTML(htmlString: string): HTMLElement {
	const div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstElementChild as HTMLElement;
}

function renderBasketInModal() {
	const basketContainer = createElementFromHTML(basketTemplate);
	const basketList = basketContainer.querySelector('.basket__list') as HTMLElement;
	const basketPrice = basketContainer.querySelector('.basket__price') as HTMLElement;
	const orderButton = basketContainer.querySelector('.basket__button') as HTMLButtonElement;

	basketList.innerHTML = '';

	const items = basketModel.getItems();
	if (items.length === 0) {
		basketList.innerHTML = '<li class="basket__empty">Корзина пуста</li>';
		orderButton.disabled = true;
	} else {
		items.forEach((item, index) => {
			const card = new CardBasket(createElementFromHTML(cardBasketTemplate), events);
			card.render(item);
			const indexElement = card.getContainer()
      .querySelector('.basket__item-index');
			if (indexElement) indexElement.textContent = String(index + 1);
			basketList.appendChild(card.getContainer());
		});
		orderButton.disabled = false;
	}

	basketPrice.textContent = `${basketModel.getTotalPrice()} синапсов`;

	orderButton.addEventListener('click', () => {
		currentStep = 'order';
		renderOrderForm();
	});

	modal.render(basketContainer);
}

function renderOrderForm() {
	const orderContainer = createElementFromHTML(orderFormTemplate);
	orderFormInstance = new OrderForm(orderContainer, events);
	
	orderFormInstance.render({
		payment: customerModel.getOrderData().payment || undefined,
		address: customerModel.getOrderData().address || undefined
	});

	events.on('order:change', (data: { field: string; value: string }) => {
		if (data.field === 'payment') {
			customerModel.setPayment(data.value as 'card' | 'online');
		} else if (data.field === 'address') {
			customerModel.setAddress(data.value);
		}
		const errors = customerModel.validate();
		const formErrors: Record<string, string> = {};
		if (errors.payment) formErrors.payment = errors.payment;
		if (errors.address) formErrors.address = errors.address;
		orderFormInstance?.valid(formErrors);
	});

	modal.render(orderContainer);
}

function renderContactsForm() {
	const contactsContainer = createElementFromHTML(contactsFormTemplate);
	contactsFormInstance = new ContactsForm(contactsContainer, events);
	
	contactsFormInstance.render({
		email: customerModel.getOrderData().email || undefined,
		phone: customerModel.getOrderData().phone || undefined
	});

	events.on('contacts:change', (data: { field: string; value: string }) => {
		if (data.field === 'email') {
			customerModel.setEmail(data.value);
		} else if (data.field === 'phone') {
			customerModel.setPhone(data.value);
		}
		const errors = customerModel.validate();
		const formErrors: Record<string, string> = {};
		if (errors.email) formErrors.email = errors.email;
		if (errors.phone) formErrors.phone = errors.phone;
		contactsFormInstance?.valid(formErrors);
	});

	modal.render(contactsContainer);
}

function renderSuccessScreen(total: number) {
	const successContainer = createElementFromHTML(successTemplate);
	const description = successContainer.querySelector('.order-success__description') as HTMLElement;
	const closeButton = successContainer.querySelector('.order-success__close') as HTMLButtonElement;

	description.textContent = `Списано ${total} синапсов`;

	closeButton.addEventListener('click', () => {
		modal.close();
	});

	modal.render(successContainer);
}

events.on('catalog:changed', () => {
	const items = catalogModel.getItems();
	const cardElements = items.map((item) => {
		const card = new CardPreview(createElementFromHTML(cardCatalogTemplate), events);
		card.render({
			...item,
			inBasket: basketModel.hasItem(item.id)
		});
		return card.getContainer();
	});
	page.setCatalog(cardElements);
});

events.on('product:selected', (data: { item: IProduct }) => {
	const card = new CardFull(createElementFromHTML(cardPreviewTemplate), events);
	card.render({
		...data.item,
		inBasket: basketModel.hasItem(data.item.id)
	});
	modal.render(card.getContainer());
});

events.on('basket:change', () => {
	page.setCounter(basketModel.getTotalItems());
});

events.on('page:basket', () => {
	renderBasketInModal();
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
		events.emit('product:selected', { item: product });
	}
});

events.on('basket:remove', (data: { id: string }) => {
	basketModel.removeItem(data.id);
});

events.on('modal:close', () => {
	modal.close();
});

events.on('order:submit', () => {
	const errors = customerModel.validate();
	const formErrors: Record<string, string> = {};
	if (errors.payment) formErrors.payment = errors.payment;
	if (errors.address) formErrors.address = errors.address;
	
	if (Object.keys(formErrors).length === 0) {
		currentStep = 'contacts';
		renderContactsForm();
	}
});

events.on('contacts:submit', () => {
	const errors = customerModel.validate();
	const formErrors: Record<string, string> = {};
	if (errors.email) formErrors.email = errors.email;
	if (errors.phone) formErrors.phone = errors.phone;
	
	if (Object.keys(formErrors).length === 0) {
		const orderData = {
			payment: customerModel.getOrderData().payment!,
			email: customerModel.getOrderData().email,
			phone: customerModel.getOrderData().phone,
			address: customerModel.getOrderData().address,
			total: basketModel.getTotalPrice(),
			items: basketModel.getItems().map(item => item.id)
		};

		api.createOrder(orderData)
			.then((result) => {
				console.log('Заказ оплачен:', result);
				basketModel.clear();
				customerModel.clear();
				renderSuccessScreen(result.total);
			})
			.catch((err) => {
				console.error('Ошибка оплаты:', err);
				alert('Ошибка при оплате заказа');
			});
	}
});

api.getProducts()
	.then((response) => {
		catalogModel.setItems(response.items);
	})
	.catch((error) => {
		console.error('Ошибка загрузки товаров:', error);
	});