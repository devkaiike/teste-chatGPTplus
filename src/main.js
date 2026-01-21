const menuSections = [
  {
    title: "Sanduíches artesanais",
    subtitle: "Carne fresca, pão brioche e molhos da casa.",
    items: [
      {
        name: "Clássico 180g",
        description: "Queijo prato, alface americana, tomate e maionese cítrica.",
        price: "R$ 24,90",
        tags: ["burger", "carne", "popular"],
        highlight: true,
      },
      {
        name: "Cheddar BBQ",
        description: "Molho barbecue defumado, cheddar cremoso e cebola crispy.",
        price: "R$ 28,50",
        tags: ["burger", "defumado"],
      },
      {
        name: "Veggie garden",
        description: "Hambúrguer de grão-de-bico, rúcula e maionese vegana.",
        price: "R$ 26,00",
        tags: ["veg", "leve"],
      },
    ],
  },
  {
    title: "Acompanhamentos",
    subtitle: "Para completar o combo com muito sabor.",
    items: [
      {
        name: "Batata rústica",
        description: "Corte especial, páprica defumada e molho aioli.",
        price: "R$ 12,90",
        tags: ["batata", "porção"],
      },
      {
        name: "Onion rings",
        description: "Anéis de cebola empanados com molho cheddar.",
        price: "R$ 14,90",
        tags: ["porção"],
      },
      {
        name: "Nachos da casa",
        description: "Tortilhas crocantes, queijo, pico de gallo e guacamole.",
        price: "R$ 18,00",
        tags: ["mex", "porção"],
        highlight: true,
      },
    ],
  },
  {
    title: "Bebidas",
    subtitle: "Refris, sucos naturais e milkshakes cremosos.",
    items: [
      {
        name: "Milkshake de baunilha",
        description: "Sorvete artesanal, chantilly e calda de caramelo.",
        price: "R$ 16,90",
        tags: ["doce", "shake"],
        highlight: true,
      },
      {
        name: "Suco cítrico",
        description: "Laranja, limão e hortelã. Zero açúcar.",
        price: "R$ 9,50",
        tags: ["suco", "leve"],
      },
      {
        name: "Refrigerante lata",
        description: "Sabores cola, guaraná ou limão.",
        price: "R$ 6,00",
        tags: ["refri"],
      },
    ],
  },
  {
    title: "Sobremesas",
    subtitle: "Finalização perfeita para o seu pedido.",
    items: [
      {
        name: "Brownie quente",
        description: "Servido com sorvete de creme e calda de chocolate.",
        price: "R$ 14,50",
        tags: ["doce"],
      },
      {
        name: "Mini churros",
        description: "Porção com doce de leite e açúcar canela.",
        price: "R$ 13,90",
        tags: ["doce", "porção"],
      },
    ],
  },
];

const tagLabels = {
  burger: "Burger",
  carne: "Carne",
  popular: "Popular",
  defumado: "Defumado",
  veg: "Veggie",
  leve: "Leve",
  batata: "Batata",
  porção: "Porção",
  mex: "Mex",
  doce: "Doce",
  shake: "Shake",
  suco: "Suco",
  refri: "Refri",
};

const menuContainer = document.querySelector("#menu");
const tagFilters = document.querySelector("#tag-filters");
const searchInput = document.querySelector("#search");

if (!menuContainer || !tagFilters || !searchInput) {
  throw new Error("Elementos principais não encontrados.");
}

const allTags = Array.from(
  new Set(menuSections.flatMap((section) => section.items.flatMap((item) => item.tags)))
).sort();

let selectedTag = null;

const createTagButton = (tag) => {
  const button = document.createElement("button");
  button.className = "tag";
  button.textContent = tagLabels[tag] ?? tag;
  button.addEventListener("click", () => {
    selectedTag = selectedTag === tag ? null : tag;
    updateTagButtons();
    renderMenu();
  });
  return button;
};

const updateTagButtons = () => {
  const buttons = Array.from(tagFilters.querySelectorAll("button"));
  buttons.forEach((button) => {
    const label = button.textContent;
    const tag = Object.keys(tagLabels).find((key) => tagLabels[key] === label) ?? label?.toLowerCase();
    if (tag && tag === selectedTag) {
      button.classList.add("tag--active");
    } else {
      button.classList.remove("tag--active");
    }
  });
};

const renderMenu = () => {
  const term = searchInput.value.toLowerCase();

  menuContainer.innerHTML = "";

  menuSections.forEach((section) => {
    const filteredItems = section.items.filter((item) => {
      const matchesTag = selectedTag ? item.tags.includes(selectedTag) : true;
      const matchesTerm = [item.name, item.description, item.tags.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(term);
      return matchesTag && matchesTerm;
    });

    if (filteredItems.length === 0) {
      return;
    }

    const sectionElement = document.createElement("article");
    sectionElement.className = "menu__section";
    sectionElement.innerHTML = `
      <header>
        <h2>${section.title}</h2>
        <p>${section.subtitle}</p>
      </header>
      <div class="menu__grid"></div>
    `;

    const grid = sectionElement.querySelector(".menu__grid");

    filteredItems.forEach((item) => {
      const card = document.createElement("div");
      card.className = "menu__card";

      if (item.highlight) {
        card.classList.add("menu__card--highlight");
      }

      card.innerHTML = `
        <div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
        <div class="menu__card-footer">
          <span>${item.price}</span>
          <button class="button button--ghost">Adicionar</button>
        </div>
      `;

      grid?.appendChild(card);
    });

    menuContainer.appendChild(sectionElement);
  });
};

const renderTags = () => {
  tagFilters.innerHTML = "";
  const allButton = document.createElement("button");
  allButton.className = "tag";
  allButton.textContent = "Todos";
  allButton.addEventListener("click", () => {
    selectedTag = null;
    updateTagButtons();
    renderMenu();
  });
  tagFilters.appendChild(allButton);

  allTags.forEach((tag) => tagFilters.appendChild(createTagButton(tag)));
  updateTagButtons();
};

searchInput.addEventListener("input", () => {
  renderMenu();
});

renderTags();
renderMenu();
