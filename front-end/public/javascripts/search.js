//This code does not work, I did not have time to get the seach functionality to work.

$(document).ready(function () {
  // Function to fetch and populate data in the table or UI
  function fetchAndPopulate(url, method, body = null) {
    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          populateTable(data.data.products);
          e;
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Call the function to test fetching data
  // Example: fetchAndPopulate('http://localhost:3000/products', 'GET');

  // Function to populate the table with products
  function populateTable(products, role) {
    const tableContainer = $("#search-results"); // Assuming this is the ID where results are displayed
    tableContainer.empty(); // Clear any previous content

    if (products && products.length > 0) {
      products.forEach((product) => {
        const productDiv = $("<div>").addClass("col-md-4 mb-4");

        productDiv.html(`
            <div class="card h-100 shadow-sm">
              <img src="${
                product.imgurl || "/images/placeholder.jpg"
              }" class="card-img-top" alt="${product.name}" />
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <p class="text-success">Price: $${parseFloat(
                  product.price
                ).toFixed(2)}</p>
                <a href="/product/${
                  product.id
                }" class="btn btn-primary">View Product</a>
              </div>
            </div>
          `);

        tableContainer.append(productDiv);
      });
    } else {
      tableContainer.html(
        "<div class='alert alert-warning text-center'>No products found.</div>"
      );
    }
  }

  // When the search button is clicked, send the search criteria
  $("#searchButton").click(function () {
    const name = $("#productName").val();
    const category = $("#productCategory option:selected").text(); // Get selected category name
    const brand = $("#productBrand option:selected").text(); // Get selected brand name

    const searchCriteria = {
      name: name || undefined,
      category: category !== "None" ? category : undefined,
      brand: brand !== "None" ? brand : undefined,
    };

    fetchAndPopulate("http://localhost:3000/search", "POST", searchCriteria); // Call your search route
  });

  // When the clear button is clicked, reset the fields and fetch all products
  $("#clearButton").click(function () {
    $("#productName").val("");
    $("#productCategory").val("");
    $("#productBrand").val("");
    fetchAndPopulate("http://localhost:3000/products", "GET"); // Fetch all products
  });

  // Fetch all products initially when the page loads
  fetchAndPopulate("/search", "GET"); // Fetch categories, brands, and products without authentication
});
