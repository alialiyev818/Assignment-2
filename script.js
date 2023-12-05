let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchAndDisplayCategories()
    setupSearchListener();
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

function setupSearchListener() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            searchProducts();
        }
    });
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    products.slice(startIndex, endIndex).forEach(product => {
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
    updatePaginationControls(products.length);
}

function updatePaginationControls(totalItems) {
    const paginationContainer = document.getElementById('pagination-controls');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchProducts();  
        });
        paginationContainer.appendChild(pageButton);
    }
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

    const backButton = document.createElement('button');
    backButton.innerText = '<<< Back to Products';
    backButton.className = 'back-button';
    backButton.onclick = goBackToProducts;

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
    document.getElementById('products-container').appendChild(backButton);
    document.getElementById('products-container').appendChild(detailsDiv);

    const galleryImages = detailsDiv.querySelectorAll('.gallery-image');
    const mainImage = detailsDiv.querySelector('.main-image');
    galleryImages.forEach(img => img.addEventListener('click', () => {
        mainImage.src = img.src;
    }));
}

function goBackToProducts() {
    fetchProducts(); // This will reload the products
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