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

    const renderBooks = () => {
        booksContainer.innerHTML = "";
        books.forEach((book) => {
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

    const updateCart = () => {
        cartItemsContainer.innerHTML = "";
        cartTotal = 0;

        cart.forEach((item) => {
            const { name, price, quantity } = item;
            const totalItemPrice = price * quantity;
            cartTotal += totalItemPrice;

            const cartItemEl = document.createElement("p");
            cartItemEl.textContent = `${name} x${quantity} - ${totalItemPrice} kr`;
            cartItemsContainer.appendChild(cartItemEl);
        });

        const now = new Date();
        const isMondayMorning = now.getDay() === 1 && now.getHours() < 10;
        isWeekendSurcharge =
            now.getDay() === 5 && now.getHours() >= 15 || 
            now.getDay() === 6 || 
            now.getDay() === 0;

        if (isMondayMorning) {
            const discount = cartTotal * 0.1;
            discountInfoEl.textContent = `Måndagsrabatt: 10% (-${discount.toFixed(2)} kr)`;
            cartTotal -= discount;
        } else {
            discountInfoEl.textContent = "";
        }

        const shipping = cartTotal > 500 ? 0 : 25 + 0.1 * cartTotal;
        shippingInfoEl.textContent = shipping === 0 ? "Frakt: Gratis" : `Frakt: ${shipping.toFixed(2)} kr`;
        cartTotal += shipping;

        totalPriceEl.textContent = cartTotal.toFixed(2);
    };

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
     
    // Remove books
    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-button")) {
            const id = parseInt(e.target.dataset.id);
            const itemIndex = cart.findIndex((item) => item.id === id);

            if (itemIndex !== -1) {
                const item = cart[itemIndex];
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart.splice(itemIndex, 1); 
                }
            }

            updateCart();
        }
    });

    // Show checkout form
    checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Din varukorg är tom!");
        } else {
            checkoutForm.style.display = "block";
        }
    });

    checkoutFormFields.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const address = document.getElementById("address").value;

        if (name && address) {
            alert(`Tack för ditt köp, ${name}! Din beställning skickas till ${address}.`);
            cart.length = 0; 
            updateCart();
            checkoutForm.style.display = "none"; 
        }
    });

    cancelCheckout.addEventListener("click", () => {
        checkoutForm.style.display = "none";
    })
    renderBooks();

