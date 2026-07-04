import "./scss/styles.scss";

import { API_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

import { EventEmitter } from "./components/base/Events";
import { WebLarekAPI } from "./components/Models/WebLarekAPI";
import { CatalogModel } from "./components/Models/CatalogModel";
import { BasketModel } from "./components/Models/BasketModel";
import { CustomerModel } from "./components/Models/CustomerModel";

import { Catalog } from "./components/View/Catalog";
import { HeaderBasket } from "./components/View/HeaderBasket";
import { Modal } from "./components/View/Modal";
import { Basket } from "./components/View/Basket";
import { SuccessModal } from "./components/View/SuccessModal";
import { OrderForm } from "./components/View/OrderForm";
import { ContactsForm } from "./components/View/ContactsForm";
import { CatalogCard } from "./components/View/CatalogCard";
import { CardBasket } from "./components/View/CardBasket";
import { ModalCard } from "./components/View/ModalCard";

import { IProduct, IOrderData, TPayment } from "./types";

const events = new EventEmitter();
const api = new WebLarekAPI(API_URL);

const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const customerModel = new CustomerModel(events);

const headerBasket = new HeaderBasket(events, document.body);
const modal = new Modal(
  document.querySelector("#modal-container") as HTMLElement,
  events,
);
const catalog = new Catalog(document.querySelector(".gallery") as HTMLElement);
const basket = new Basket(cloneTemplate("basket"), events);
const orderForm = new OrderForm(cloneTemplate("order"), events);
const contactsForm = new ContactsForm(cloneTemplate("contacts"), events);
const successModal = new SuccessModal(cloneTemplate("success"), events);

function createCatalogCard(product: IProduct): HTMLElement {
  const card = new CatalogCard(cloneTemplate("card-catalog"), events, () => {
    events.emit("product:select", { id: product.id });
  });
  card.render({
    ...product,
    inCart: basketModel.hasItem(product.id),
  });
  return card.render();
}

function createBasketItem(product: IProduct, index: number): HTMLElement {
    const card = new CardBasket(
        cloneTemplate('card-basket'),
        events,
        product.id
    );
    card.render({
        ...product,
        index: index + 1
    });
    return card.render();
}

function renderCatalog(): void {
  const items = catalogModel.getItems();
  const cards = items.map((product) => createCatalogCard(product));
  catalog.catalog = cards;
}

function renderBasket(): void {
  const items = basketModel.getItems();
  const views = items.map((product, index) => createBasketItem(product, index));

  basket.items = views;
  basket.totalPrice = basketModel.getTotalPrice();
  headerBasket.counter = basketModel.getTotalItems();
}

function renderOrderForm(): void {
  const data = customerModel.getOrderData();
  const allErrors = customerModel.validate();

  const orderErrors: Record<string, string> = {};
  if (allErrors.payment) orderErrors.payment = allErrors.payment;
  if (allErrors.address) orderErrors.address = allErrors.address;

  orderForm.render({
    address: data.address || "",
    payment: data.payment || undefined,
  });

  orderForm.errorText = Object.values(orderErrors).join("; ");
  orderForm.isValid = Object.keys(orderErrors).length === 0;
}

function renderContactsForm(): void {
  const data = customerModel.getOrderData();
  const allErrors = customerModel.validate();

  const contactsErrors: Record<string, string> = {};
  if (allErrors.email) contactsErrors.email = allErrors.email;
  if (allErrors.phone) contactsErrors.phone = allErrors.phone;

  contactsForm.render({
    email: data.email || "",
    phone: data.phone || "",
  });

  contactsForm.errorText = Object.values(contactsErrors).join("; ");
  contactsForm.isValid = Object.keys(contactsErrors).length === 0;
}

events.on("catalog:changed", () => {
  renderCatalog();
});

events.on("basket:change", () => {
  renderBasket();
  renderCatalog();
});

events.on("customer:change", () => {
  renderOrderForm();
  renderContactsForm();
});

events.on("basket:open", () => {
  renderBasket();
  modal.open(basket.render());
});

events.on("basket:remove", (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

events.on("basket:submit", () => {
  renderOrderForm();
  modal.open(orderForm.render());
});

events.on("order:payment-change", (data: { field: string; value: string }) => {
  if (data.field === "address") {
    customerModel.setAddress(data.value);
  } else if (data.field === "payment") {
    customerModel.setPayment(data.value as TPayment);
  }
});

events.on("order:submit", () => {
  renderContactsForm();
  modal.open(contactsForm.render());
});

events.on("order:contacts-change", (data: { field: string; value: string }) => {
  if (data.field === "email") {
    customerModel.setEmail(data.value);
  } else if (data.field === "phone") {
    customerModel.setPhone(data.value);
  }
});

events.on("contacts:submit", async () => {
  const orderData = customerModel.getOrderData();
  const items = basketModel.getItems();

  const order: IOrderData = {
    payment: orderData.payment || "cash",
    email: orderData.email,
    phone: orderData.phone,
    address: orderData.address,
    items: items.map((p) => p.id),
    total: basketModel.getTotalPrice(),
  };

  try {
    const result = await api.createOrder(order);

    basketModel.clear();
    customerModel.clear();

    successModal.render({ total: result.total });
    modal.open(successModal.render());
  } catch (error) {
    console.error("Ошибка оформления заказа", error);
  }
});

events.on("product:select", (data: { id: string }) => {
  const product = catalogModel.getItemById(data.id);
  if (!product) return;

  catalogModel.setSelectedProduct(product);

  const card = new ModalCard(cloneTemplate("card-preview"), events, () => {
    events.emit("product:select", { id: product.id });
  });

  let buttonText: string;
  let buttonDisabled: boolean;

  if (product.price === null) {
    buttonText = "Недоступно";
    buttonDisabled = true;
  } else if (basketModel.hasItem(product.id)) {
    buttonText = "Удалить из корзины";
    buttonDisabled = false;
  } else {
    buttonText = "В корзину";
    buttonDisabled = false;
  }

  const renderedCard = card.render({
    ...product,
    description: product.description,
    buttonText: buttonText,
    buttonDisabled: buttonDisabled,
  });

  modal.open(renderedCard);
});

events.on("card:buy", () => {
  const product = catalogModel.getSelectedProduct();
  if (!product || product.price === null) return;

  if (basketModel.hasItem(product.id)) {
    basketModel.removeItem(product.id);
  } else {
    basketModel.addItem(product);
  }
  modal.close();
});

events.on("modal:close", () => {
  modal.close();
});

events.on("success:close", () => {
  modal.close();
});

api
  .getProducts()
  .then((response: { items: IProduct[] }) => {
    catalogModel.setItems(response.items);
  })
  .catch((error) => {
    console.error("Ошибка загрузки товаров:", error);
  });
