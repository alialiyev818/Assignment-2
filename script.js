
// Function to fetch products data

let http = new XMLHttpRequest();
http.open('get', 'products.json', true);
http.send();

function fetchProducts() {
    // URL to the products.json file
    const url = 'products.json';

    // Fetch the JSON data
    fetch(url)
        .then(response => {
            // Check if the response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the JSON response
            return response.json();
        })
        .then(data => {
            // Process the products data
            console.log('Products:', data.products);
        })
        .catch(error => {
            // Handle any errors
            console.error('Error fetching products:', error);
        });
}

// Call the function to fetch products
fetchProducts();
