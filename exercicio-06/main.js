let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Função para alternar entre seções
function showSection(section) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
        sec.style.display = 'none';
        if (sec.id === section) {
            sec.style.display = 'block';
        }
    });
}

// Carregar produtos do JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        renderProducts(products); // Renderiza os produtos após o carregamento
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Renderiza os produtos na página inicial
function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpa o conteúdo atual

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');
        productDiv.innerHTML = `
            <img src="${product.images}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>Preço: R$${product.price.toFixed(2)}</p>
            <button onclick="addToCart('${product.id}')">Adicionar ao Carrinho</button>
        `;
        productList.appendChild(productDiv);
    });
}

// Função para adicionar um produto ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} foi adicionado ao carrinho!`);
}

// Renderiza os produtos no carrinho
function renderCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Limpa o conteúdo do carrinho

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>Preço: R$${item.price.toFixed(2)}</p>
            <p>Quantidade: ${item.quantity}</p>
            <button onclick="removeFromCart('${item.id}')">Remover</button>
        `;
        cartList.appendChild(cartItem);
    });

    if (cart.length === 0) {
        cartList.innerHTML = '<p>Carrinho vazio</p>';
    }
}

// Filtros de produtos
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const brand = document.getElementById('brand-filter').value;
    const searchTerm = document.getElementById('search').value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory = category ? product.category === category : true;
        const matchesBrand = brand ? product.brand === brand : true;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesBrand && matchesSearch;
    });

    renderProducts(filteredProducts);
}

// Remove um produto do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Finaliza a compra
function checkout() {
    if (cart.length === 0) {
        alert('O carrinho está vazio!');
        return;
    }

    alert('Compra finalizada com sucesso!');
    cart = []; // Limpa o carrinho após a compra
    localStorage.setItem('cart', JSON.stringify(cart)); // Atualiza o carrinho no localStorage
    showSection('home'); // Volta para a página inicial
}

// Inicializa o carregamento dos produtos e do carrinho
window.onload = () => {
    loadProducts();
    renderCart();
};
