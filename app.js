const menuItems = [
  {
    id: "burger",
    name: "Burger Artesanal",
    description: "Pão brioche, blend 160g e queijo derretido.",
    image: "images/burger.svg",
  },
  {
    id: "salad",
    name: "Salada Tropical",
    description: "Mix de folhas, manga e castanhas crocantes.",
    image: "images/salada.svg",
  },
  {
    id: "pasta",
    name: "Penne Cremoso",
    description: "Molho de tomate rústico e manjericão fresco.",
    image: "images/penne.svg",
  },
  {
    id: "dessert",
    name: "Sobremesa Lunar",
    description: "Mousse de chocolate com frutas vermelhas.",
    image: "images/sobremesa.svg",
  },
];

const menuContainer = document.querySelector("#menu");
const ordersContainer = document.querySelector("#orders");
const orderTemplate = document.querySelector("#order-template");
const customerInput = document.querySelector("#customer-name");
const randomButton = document.querySelector("#send-random");

const orders = [];

function renderMenu() {
  menuContainer.innerHTML = "";
  menuItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    card.setAttribute("role", "listitem");

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}" loading="lazy" />
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <button type="button" data-id="${item.id}">Adicionar ao pedido</button>
    `;

    const button = card.querySelector("button");
    button.addEventListener("click", () => addOrder([item]));

    menuContainer.appendChild(card);
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addOrder(items) {
  const customerName = customerInput.value.trim() || "Cliente";
  const order = {
    id: crypto.randomUUID(),
    customer: customerName,
    items,
    createdAt: new Date(),
    status: "Recebido",
  };
  orders.unshift(order);
  renderOrders();
}

function toggleReady(id) {
  const order = orders.find((entry) => entry.id === id);
  if (!order) return;
  order.status = order.status === "Pronto" ? "Recebido" : "Pronto";
  renderOrders();
}

function renderOrders() {
  ordersContainer.innerHTML = "";

  if (!orders.length) {
    const empty = document.createElement("p");
    empty.className = "order-items";
    empty.textContent = "Nenhum pedido recebido ainda.";
    ordersContainer.appendChild(empty);
    return;
  }

  orders.forEach((order) => {
    const orderCard = orderTemplate.content.cloneNode(true);
    const card = orderCard.querySelector(".order-card");
    card.dataset.id = order.id;

    orderCard.querySelector(".order-title").textContent = `${order.customer}`;
    orderCard.querySelector(".order-status").textContent = order.status;
    orderCard.querySelector(".order-items").textContent = order.items
      .map((item) => item.name)
      .join(" · ");
    orderCard.querySelector(".order-time").textContent = `Recebido às ${formatTime(
      order.createdAt
    )}`;

    const readyButton = orderCard.querySelector(".mark-ready");
    readyButton.textContent =
      order.status === "Pronto" ? "Marcar recebido" : "Marcar pronto";
    if (order.status === "Pronto") {
      readyButton.classList.add("ready");
    }
    readyButton.addEventListener("click", () => toggleReady(order.id));

    ordersContainer.appendChild(orderCard);
  });
}

function addRandomOrder() {
  const count = Math.ceil(Math.random() * 3);
  const items = [...menuItems]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
  addOrder(items);
}

randomButton.addEventListener("click", addRandomOrder);

renderMenu();
renderOrders();
