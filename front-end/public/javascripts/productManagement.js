document.addEventListener("DOMContentLoaded", () => {
  const productModal = new bootstrap.Modal(
    document.getElementById("productModal")
  );
  const productForm = document.getElementById("productForm");

  // Form fields
  const productIdField = document.getElementById("productId");
  const productNameField = document.getElementById("productName");
  const productDescriptionField = document.getElementById("productDescription");
  const productPriceField = document.getElementById("productPrice");
  const productQuantityField = document.getElementById("productQuantity");
  const productDateAddedField = document.getElementById("productDateAdded");
  const productImageUrlField = document.getElementById("productImageUrl");
  const productStatusField = document.getElementById("productStatus");
  const productBrandNameField = document.getElementById("productBrandName");
  const productCategoryNameField = document.getElementById(
    "productCategoryName"
  );

  let editingProductId = null;

  // Handle Add Product Button
  document.getElementById("addProductButton").addEventListener("click", () => {
    editingProductId = null; // Reset editing mode
    resetFormFields();
    productModal.show();
  });

  // Event delegation for table buttons (edit, delete, undelete)
  document.querySelector("table").addEventListener("click", (e) => {
    const target = e.target;

    if (target.classList.contains("btn-edit")) {
      const productId = target.closest("tr").dataset.productId;
      fetchProductDetails(productId);
    }

    if (target.classList.contains("btn-delete")) {
      const productId = target.closest("tr").dataset.productId;
      deleteProduct(productId);
    }

    if (target.classList.contains("undelete-product")) {
      const productId = target.closest("tr").dataset.productId;
      undeleteProduct(productId);
    }
  });

  // Save or Update Product
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productData = {
      name: productNameField.value,
      description: productDescriptionField.value,
      price: parseFloat(productPriceField.value),
      quantity: parseInt(productQuantityField.value),
      date_added: productDateAddedField.value,
      imgurl: productImageUrlField.value,
      status: productStatusField.value,
      brandName: productBrandNameField.value,
      categoryName: productCategoryNameField.value,
    };

    const method = editingProductId ? "PUT" : "POST"; // Use PUT when editing
    const url = editingProductId
      ? `http://localhost:3000/products/${editingProductId}` // Ensure correct URL for editing
      : "http://localhost:3000/products";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in headers
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        alert(
          editingProductId
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        if (editingProductId) {
          // If we're editing, update the row in the table
          const row = document.querySelector(
            `tr[data-product-id="${editingProductId}"]`
          );
          row.querySelector("td:nth-child(2)").textContent = productData.name;
          row.querySelector("td:nth-child(3)").textContent =
            productData.description;
          row.querySelector("td:nth-child(4)").textContent =
            productData.quantity;
          row.querySelector(
            "td:nth-child(5)"
          ).textContent = `$${productData.price}`;
          row.querySelector("td:nth-child(6)").textContent =
            productData.discount || "N/A";
          row.querySelector("td:nth-child(7)").textContent =
            productData.brandName;
          row.querySelector("td:nth-child(8)").textContent =
            productData.categoryName;
          row.querySelector("td:nth-child(9)").textContent = productData.imgurl;
          row.querySelector("td:nth-child(10) img").src = productData.imgurl;
          row.querySelector("td:nth-child(11)").textContent =
            productData.status;
        }
        location.reload(); // Reload the page to reflect changes
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  });

  // Fetch Product Details for Editing
  async function fetchProductDetails(productId) {
    try {
      // Send a GET request to fetch the product details from the backend
      const response = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const product = data.data.product; // Access the product data

        // Set the editingProductId to the selected product
        editingProductId = product.id;

        // Populate form fields with fetched product data
        productIdField.value = product.id; // Set product id (hidden field)
        productNameField.value = product.name || ""; // Pre-fill the product name
        productDescriptionField.value = product.description || ""; // Pre-fill the description
        productPriceField.value = product.price || ""; // Pre-fill the price
        productQuantityField.value = product.quantity || ""; // Pre-fill the quantity
        productDateAddedField.value = product.date_added || ""; // Pre-fill the date added
        productImageUrlField.value = product.imgurl || ""; // Pre-fill the image URL
        productStatusField.value = product.status || "available"; // Pre-fill the status (default to "available")
        productBrandNameField.value = product.brand || ""; // Pre-fill the brand name
        productCategoryNameField.value = product.category || ""; // Pre-fill the category name

        productModal.show(); // Show the modal to edit the product
      } else {
        alert("Failed to fetch product details.");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }

  // Delete Product
  async function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/products/${productId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          alert("Product deleted successfully!");
          location.reload();
        } else {
          alert("Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  }

  // Undelete Product
  async function undeleteProduct(productId) {
    try {
      const response = await fetch(
        `http://localhost:3000/products/${productId}/undelete`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Product undeleted successfully!");
        location.reload();
      } else {
        alert("Failed to undelete product.");
      }
    } catch (error) {
      console.error("Error undeleting product:", error);
    }
  }

  // Reset form fields
  function resetFormFields() {
    productIdField.value = "";
    productNameField.value = "";
    productDescriptionField.value = "";
    productPriceField.value = "";
    productQuantityField.value = "";
    productDateAddedField.value = "";
    productImageUrlField.value = "";
    productStatusField.value = "available"; // Set default status to available
    productBrandNameField.value = ""; // Reset brand name
    productCategoryNameField.value = ""; // Reset category name
  }
});
