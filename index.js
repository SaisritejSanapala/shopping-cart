const products = [];
const cart = {
    items: []
};

let filteredCartData = [];



function createProductCard(product) {
    const card = document.createElement('li');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = product.image;
    card.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = product.title;
    card.appendChild(title);

    const price = document.createElement('p');
    price.textContent = `$${product.price}`;
    card.appendChild(price);

    const button = document.createElement('button');
    button.textContent = 'Add to Cart';
    button.addEventListener('click', () => addToCart(product.id));
    card.appendChild(button);

    return card;
}



function renderProducts() {
    const productsSection = document.getElementById('productsList');
    products.forEach(product => {
        const card = createProductCard(product);
        productsSection.appendChild(card);
    });
}




function renderCartItem(item) {
    const card = document.createElement('li');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = item.image;
    card.appendChild(img);

    const title = document.createElement('h3');
    title.textContent = item.title;
    card.appendChild(title);

    const price = document.createElement('p');
    price.textContent = `$${item.price} x ${item.quantity}`;
    card.appendChild(price);

    const button = document.createElement('button');
    button.textContent = 'Remove';
    button.addEventListener('click', () => removeCartItem(item.id));
    card.appendChild(button);

    return card;
}




function renderCartProducts() {
    const cartSection = document.getElementById('cart-list');
    cartSection.innerHTML = '';

  const cartItems = filteredCartData.length > 0 ? filteredCartData : cart.items;

    if (cartItems.length !== 0) {
       cartItems.forEach(item => {
            const card = renderCartItem(item);
            cartSection.appendChild(card);
        });
    } else {
        const emptyCartMessage = document.createElement('li');
        emptyCartMessage.textContent = 'Your cart is empty.';
        cartSection.appendChild(emptyCartMessage);
    }

    filteredCartData = []

    calculateTotalPrice();
    calculateAveragePrice();
}



function fetchData() {
    fetch('./dummy.json')
        .then(response => response.json())
        .then(data => {
            products.push(...data.products);
            const storedCart = JSON.parse(localStorage.getItem('cart-data'));
            cart.items = storedCart ? storedCart.items : [];

            renderProducts();
            renderCartProducts();
        })
        .catch(error => console.log(error));
}


function addToCart(id) {
    const existingCartItem = cart.items.find(item => item.id === id);

    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        const productToAdd = products.find(product => product.id === id);

        if (productToAdd) {
            cart.items.push({
                id: productToAdd.id,
                title: productToAdd.title,
                image: productToAdd.image,
                price: productToAdd.price,
                quantity: 1
            });
        }
    }

    localStorage.setItem("cart-data", JSON.stringify(cart));
    renderCartProducts();
}



function removeCartItem(id) {
    cart.items = cart.items.filter(item => item.id !== id);
    localStorage.setItem('cart-data', JSON.stringify(cart));
    renderCartProducts();
}

function calculateTotalPrice() {
    const totalPrice = document.getElementById('total');
    const total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    totalPrice.textContent = `$${total || 0}`;
}

function calculateAveragePrice() {
    const totalProducts = cart.items.length;
    const total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    const average = document.getElementById('average');
    average.textContent = totalProducts > 0 ? `$${(total / totalProducts).toFixed(2)}` : '$0';
}

function sortCartByPrice(value) {
 
    cart.items.sort((a, b) => (value === 'ascending') ? a.price - b.price : b.price - a.price);
    renderCartProducts();
}

function filterCartByPrice(value) {

    const filteredData = cart.items.filter((item) => item.price >= value)
    filteredCartData = filteredData

    renderCartProducts();
}


document.getElementById('sortSelect').addEventListener('change', function (e) {
    sortCartByPrice(e.target.value);
});

document.getElementById('pricefilterinput').addEventListener('input', function (e) {
    filterCartByPrice(e.target.value);
});

document.getElementById('cartClearButton').addEventListener('click', function () {
    cart.items = [];
    filteredCartData = []
    localStorage.removeItem('cart-data');
    renderCartProducts();
});

fetchData();
