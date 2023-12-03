document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(1, 10); // Fetch the first page with 10 products per page
});

async function fetchProducts(page, limit) {
    try {
        const response = await fetch(`https://dummyjson.com/products?skip=${(page - 1) * limit}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayProducts(data.products, page, limit, data.total);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
}

function displayProducts(products, currentPage, limit, totalProducts) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        // existing code to create product elements
    });

    createPaginationControls(currentPage, limit, totalProducts);
}

function createPaginationControls(currentPage, limit, totalProducts) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalProducts / limit);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = () => fetchProducts(i, limit);
        if (currentPage === i) {
            pageButton.classList.add('active');
        }
        paginationContainer.appendChild(pageButton);
    }
}

/*fetching the details*/

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
    // Clear the existing content
    document.getElementById('products-container').innerHTML = '';

    // Create a new div for product details
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

    // Add click event listeners to each gallery image
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

