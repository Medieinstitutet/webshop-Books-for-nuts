const books = [        
    { id: 1, name: "Hjärtats skuggor", price: 200, rating: 4.5, category: "Roman" },
    { id: 2, name: "Drakens arv", price: 150, rating: 4.2, category: "Fantasy" },
    { id: 3, name: "Mörka hemligheter", price: 180, rating: 3.8, category: "Deckare" },
    { id: 4, name: "Vindens röster", price: 220, rating: 4.7, category: "Roman" },
    { id: 5, name: "Stjärnornas portar", price: 175, rating: 4.0, category: "Sci-fi" },
    { id: 6, name: "Mitt liv i ljuset", price: 300, rating: 5.0, category: "Biografi" },
    { id: 7, name: "Månens väktare", price: 130, rating: 3.5, category: "Fantasy" },
    { id: 8, name: "Sista sommaren vid sjön", price: 200, rating: 4.1, category: "Roman" },
    { id: 9, name: "Mörka hemligheter", price: 140, rating: 3.8, category: "Deckare" },
    { id: 10, name: "Framtidens världar", price: 190, rating: 4.4, category: "Sci-fi" },
];

const cart = [];
let cartTotal = 0;
let isWeekendSurcharge = false;

const booksContainer = document.getElementById("books-container");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");
const discountInfoEl = document.getElementById("discount-info");
const shippingInfoEl = document.getElementById("shipping-info");
const sortButton = document.getElementById('sort-button');
const sortSelect = document.getElementById('sort-options');
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutForm = document.getElementById("checkout-form");
const cancelCheckoutBtn = document.getElementById("cancel-btn");
const confirmationMessage = document.getElementById("confirmation-message");
const form = document.getElementById("checkout-form-fields");
const submitBtn = document.getElementById("submit-btn");
const resetBtn = document.getElementById("reset-btn");
const cancelBtn = document.getElementById("cancel-btn");
const personnummerField = document.getElementById("personnummer");
const personnummerError = document.getElementById("personnummer-error");
const paymentCard = document.getElementById("payment-card");
const paymentInvoice = document.getElementById("payment-invoice");
const cardFields = document.getElementById("card-fields");
const invoiceFields = document.getElementById("invoice-fields");


checkoutForm.style.display = "none";
confirmationMessage.style.display = "none";

// Sortera böcker
const renderBooks = (booksToRender) => {
    booksContainer.innerHTML = "";
    booksToRender.forEach((book) => {
        const bookEl = document.createElement("div");
        bookEl.className = "book-item";
        bookEl.innerHTML = `
            <h3>${book.name}</h3>
            <p>${book.category}</p>
            <p>${book.rating} stjärnor</p>
            <p>${book.price} kr</p>
            <button data-id="${book.id}">Lägg i varukorg</button>
        `;
        booksContainer.appendChild(bookEl);
    });
};

// Sortera böcker
const sortBooks = (criteria) => {
    let sortedBooks = [...books]; 
    if (criteria === 'name') {
        sortedBooks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (criteria === 'price') {
        sortedBooks.sort((a, b) => a.price - b.price);
    } else if (criteria === 'category') {
        sortedBooks.sort((a, b) => a.category.localeCompare(b.category));
    } else if (criteria === 'rating') {
        sortedBooks.sort((a, b) => b.rating - a.rating);
    }

    renderBooks(sortedBooks);
};

sortButton.addEventListener('click', () => {
    const selectedOption = sortSelect.value; 
    sortBooks(selectedOption);
});

// Uppdatera varukorgen
const updateCart = () => {
    cartItemsContainer.innerHTML = ""; 
    cartTotal = 0; 

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Din varukorg är tom.</p>";
    }

    // Visa varor i varukorgen
    cart.forEach((item, index) => {
        const { name, price, quantity } = item;
        const totalItemPrice = price * quantity;
        cartTotal += totalItemPrice;

        const cartItemEl = document.createElement("div");
        cartItemEl.className = "cart-item";
        cartItemEl.innerHTML = `
            <p>${name} x${quantity} - ${totalItemPrice} kr</p>
            <button class="remove-item" data-index="${index}">Ta bort</button>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    // Rabattberäkning
    const now = new Date();
    const isMondayMorning = now.getDay() === 1 && now.getHours() < 10;
    isWeekendSurcharge =
        now.getDay() === 5 && now.getHours() >= 15 || 
        now.getDay() === 6 || 
        now.getDay() === 0;

    // Måndagsrabatt
    if (isMondayMorning) {
        const discount = cartTotal * 0.1;
        discountInfoEl.textContent = `Måndagsrabatt: 10% (-${discount.toFixed(2)} kr)`;
        cartTotal -= discount;
    } else {
        discountInfoEl.textContent = "";
    }

    // Fraktkostnad
    const shipping = cartTotal > 500 ? 0 : 25 + 0.1 * cartTotal;
    shippingInfoEl.textContent = shipping === 0 ? "Frakt: Gratis" : `Frakt: ${shipping.toFixed(2)} kr`;
    cartTotal += shipping;

   
    totalPriceEl.textContent = cartTotal.toFixed(2);
};

// Lägg till varor i varukorgen
booksContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const id = parseInt(e.target.dataset.id);
        const book = books.find((b) => b.id === id);

        const existingItem = cart.find((item) => item.id === id);
        if (existingItem) {
           
            existingItem.quantity++;
        } else {
            
            cart.push({ ...book, quantity: 1 });
        }

        
        updateCart();
    }
});


cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-item")) {
        const index = parseInt(e.target.dataset.index);
        cart.splice(index, 1); 
        updateCart(); 
    }
});


checkoutBtn.addEventListener("click", () => {
    checkoutForm.style.display = "block"; 
    confirmationMessage.style.display = "none"; 
});


cancelCheckoutBtn.addEventListener("click", () => {
    checkoutForm.style.display = "none";
    confirmationMessage.style.display = "none"; n
});


form.addEventListener("submit", (e) => {
    e.preventDefault();
    confirmationMessage.style.display = "block"; 
    checkoutForm.style.display = "none"; 
});


const validateForm = () => {
    const allFields = form.querySelectorAll("input[required]");
    let valid = true;

    allFields.forEach((field) => {
        if (!field.checkValidity()) {
            valid = false;
        }
    });

    if (paymentInvoice.checked && !personnummerField.checkValidity()) {
        valid = false;
        personnummerError.style.display = "inline";
    } else {
        personnummerError.style.display = "none";
    }

    submitBtn.disabled = !valid;
};

form.addEventListener("input", validateForm);


paymentCard.addEventListener("change", () => {
    cardFields.style.display = "block";
    invoiceFields.style.display = "none";
    validateForm();
});

paymentInvoice.addEventListener("change", () => {
    cardFields.style.display = "none";
    invoiceFields.style.display = "block";
    validateForm();
});


resetBtn.addEventListener("click", () => {
    form.reset();
    confirmationMessage.style.display = "none";
    cardFields.style.display = "block";
    invoiceFields.style.display = "none";
    validateForm();
});


cancelBtn.addEventListener("click", () => {
    form.reset();
    confirmationMessage.style.display = "none";
    checkoutForm.style.display = "none";
    cardFields.style.display = "block";
    invoiceFields.style.display = "none";
    validateForm();
});

validateForm();
renderBooks(books);
