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

async function fetchAndDisplayCategories() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        console.error('Error fetching categories: ', error);
    }
}

function displayCategories(categories) {
    const filterContainer = document.getElementById('category-filter');
    categories.forEach(category => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = category;
        checkbox.name = category;
        checkbox.value = category;

        const label = document.createElement('label');
        label.htmlFor = category;
        label.appendChild(document.createTextNode(category));

        const div = document.createElement('div');
        div.appendChild(checkbox);
        div.appendChild(label);
        
        filterContainer.appendChild(div);
    });

    
    categories.forEach(category => {
        document.getElementById(category).addEventListener('change', filterProductsByCategory);
    });
}

async function filterProductsByCategory() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const selectedCategories = Array.from(document.querySelectorAll('#category-filter input:checked')).map(input => input.value);
        const filteredProducts = data.products.filter(product => selectedCategories.includes(product.category));
        displayProducts(filteredProducts.length > 0 ? filteredProducts : data.products);
    } catch (error) {
        console.error('Error filtering products: ', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchAndDisplayCategories(); 
});