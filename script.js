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
    container.innerHTML = '';
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">
                <img src="${product.thumbnail}" alt="${product.title}" />
            </div>
            <div class="product-info">
                <h2>${product.title}</h2>
                <p>Price: $${product.price}</p>
                <p>Discount: ${product.discountPercentage}%</p>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>
            </div>
        `;
        productElement.addEventListener('click', () => {
            fetchProductDetails(product.id);
        });
        container.appendChild(productElement);
    });
}

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        console.error('Error fetching product details: ', error);
    }
}

function displayProductDetails(product) {
    document.getElementById('products-container').innerHTML = '';
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'product-details';
    detailsDiv.innerHTML = `
        <h2>${product.title}</h2>
        <img src="${product.thumbnail}" alt="${product.title}" class="main-image" />
        <p>Description: ${product.description}</p>
        <p>Price: $${product.price}</p>
        <p>Discount: ${product.discountPercentage}%</p>
        <p>Rating: ${product.rating}</p>
        <p>Stock: ${product.stock}</p>
        <p>Brand: ${product.brand}</p>
        <p>Category: ${product.category}</p>
        <div class="product-images">
            ${product.images.map(image => `<img src="${image}" alt="${product.title} image" class="gallery-image">`).join('')}
        </div>
    `;
    document.getElementById('products-container').appendChild(detailsDiv);

    const galleryImages = detailsDiv.querySelectorAll('.gallery-image');
    const mainImage = detailsDiv.querySelector('.main-image');
    galleryImages.forEach(img => img.addEventListener('click', () => {
        mainImage.src = img.src;
    }));
}

async function searchProducts() {
    try {
        const searchQuery = document.getElementById('search-input').value.toLowerCase();
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const filteredProducts = data.products.filter(product => 
            product.title.toLowerCase().includes(searchQuery) ||
            product.description.toLowerCase().includes(searchQuery) ||
            product.category.toLowerCase().includes(searchQuery)
        );
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error searching products: ', error);
    }
}

async function fetchAndPopulateCategories() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const categories = await response.json();
        const selectBox = document.getElementById('category-filter');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            selectBox.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories: ', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchAndPopulateCategories(); 
});

async function filterByCategory() {
    const selectedCategory = document.getElementById('category-filter').value;
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        let filteredProducts = data.products;
        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
        }
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error filtering products: ', error);
    }
}