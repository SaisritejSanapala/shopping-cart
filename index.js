const products = [];
const cart = {
    items: []
};



function fetchData() {
    fetch('/dummy.json')
        .then(response => response.json())
        .then(data => {
            // Add fetched products to the array
            products.push(...data.products);

            // Render the products after fetching the data
            renderProducts();
            renderCartProducts();
        })
        .catch(error => console.log(error));
}

function renderProducts() {
    let productsSection = document.getElementById('productsList');


    products.forEach((product) => {
        let card = document.createElement('li');
        card.className = 'product-card';

        let img = document.createElement('img');
        img.src = product.image;
        card.appendChild(img);

        let title = document.createElement('h3');
        title.textContent = product.title;
        card.appendChild(title);

        let price = document.createElement('p');
        price.textContent = `$${product.price}`;
        card.appendChild(price);

        let button = document.createElement('button');
        button.textContent = 'Add to Cart';
        button.addEventListener('click', () => addToCart(product.id));

        card.appendChild(button);

        productsSection.appendChild(card);
    });

}

function addToCart(id) {
    // Check if the product is already in the cart
    const existingCartItem = cart.items.find(item => item.id === id);

    if (existingCartItem) {
        // If the product exists, increment its quantity
        existingCartItem.quantity += 1;
    } else {
        // If the product does not exist, find it in the products array
        const productToAdd = products.find(product => product.id === id);

        if (productToAdd) {
            // Add the product to the cart with a quantity of 1
            cart.items.push({
                id: productToAdd.id,
                title: productToAdd.title,
                image: productToAdd.image,
                price: productToAdd.price,
                quantity: 1
            });
        }
    }

    // Update the cart display
    renderCartProducts();

}

function renderCartProducts() {
    let cartSection = document.getElementById('cart-list');
    cartSection.innerHTML = '';

    if (cart.items.length !== 0) {
        cart.items.forEach((item) => {
            let card = document.createElement('li');
            card.className = 'product-card';

            let img = document.createElement('img');
            img.src = item.image;
            card.appendChild(img);

            let title = document.createElement('h3');
            title.textContent = item.title;
            card.appendChild(title);

            let price = document.createElement('p');
            price.textContent = `$${item.price} x ${item.quantity}`;
            card.appendChild(price);

            let button = document.createElement('button');
            button.textContent = 'Remove';
            button.addEventListener('click', () => removeCartItem(item.id));

            card.appendChild(button);

            cartSection.appendChild(card);


        });
    } else {
        // If the cart is empty, display a message
        let emptyCartMessage = document.createElement('li');
        emptyCartMessage.textContent = 'Your cart is empty.';
        cartSection.appendChild(emptyCartMessage);
    }

    calculateTotalPrice();
    calculateAveragePrice()

}

function removeCartItem(id) {
    // Remove the item from the cart based on its id
    cart.items = cart.items.filter(item => item.id !== id);

    // Update the cart display
    renderCartProducts();
}


function calculateTotalPrice() {
    let totalPrice = document.getElementById('total');
    if (cart.items.length !== 0) {
        const total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);


        totalPrice.textContent = `$${total}`

    }
    else {
        totalPrice.textContent = `$0`
    }


}

function calculateAveragePrice() {
    const totalProducts = cart.items.length;
    const total = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    let average = document.getElementById('average');

    if (totalProducts > 0) {
        const averagePrice = total / totalProducts;
        average.textContent = `$${averagePrice.toFixed(2)}`;
    } else {
        average.textContent = '$0';
    }
}



function sortCartByPrice(value) {
    cart.items.sort((a, b) => {
        return (value === 'ascending') ? a.price - b.price : b.price - a.price;
    });
}

function clearCart() {
    cart.items = [];
    renderCartProducts(); // Update the cart display after clearing
}


function filteredItems(e) {
    cart.items = cart.items.filter((item) => item.price >= e.target.value);
}


document.querySelector('input').addEventListener('keyup', function (e) {
    filteredItems(e)
    renderCartProducts();
});


// Add event listener to the select element for sorting
document.getElementById('sortSelect').addEventListener('change', function (e) {
    sortCartByPrice(e.target.value);
    renderCartProducts();
});



let clearCartButton = document.getElementById('cartClearButton');
clearCartButton.addEventListener("click", function () {
    cart.items = []
    renderCartProducts()
})
// Call the fetchData function to initiate the data fetching
fetchData();
