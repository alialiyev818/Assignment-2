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
