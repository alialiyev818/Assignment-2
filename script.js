document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
});

async function fetchProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.thumbnail}" alt="${product.title}" />
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
        `;
        container.appendChild(productElement);
    });
}