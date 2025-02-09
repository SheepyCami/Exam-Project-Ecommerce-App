document.addEventListener("DOMContentLoaded", () => {
  const addBrandButton = document.getElementById("addBrandButton");
  const brandModal = new bootstrap.Modal(document.getElementById("brandModal"));
  const brandForm = document.getElementById("brandForm");

  const brandIdField = document.getElementById("brandId");
  const brandNameField = document.getElementById("brandName");

  let editingBrandId = null;

  // Show modal for adding a brand
  addBrandButton.addEventListener("click", () => {
    editingBrandId = null;
    resetFormFields();
    brandModal.show();
  });

  // Handle Save (Add or Edit)
  brandForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const brandData = {
      name: brandNameField.value,
    };

    const method = editingBrandId ? "PUT" : "POST";
    const url = editingBrandId
      ? `http://localhost:3000/brands/${editingBrandId}`
      : "http://localhost:3000/brands";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brandData),
      });

      if (response.ok) {
        alert(editingBrandId ? "Brand updated!" : "Brand added!");
        location.reload();
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  });

  // Handle Edit Button Click
  document.querySelectorAll(".btn-edit").forEach((editButton) => {
    editButton.addEventListener("click", async (e) => {
      const brandRow = e.target.closest("tr");
      editingBrandId = brandRow.dataset.brandId;

      try {
        const response = await fetch(
          `http://localhost:3000/brands/${editingBrandId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const brandResponse = await response.json();
          const brand = brandResponse.data;

          brandIdField.value = brand.id;
          brandNameField.value = brand.name;

          brandModal.show();
        } else {
          alert("Failed to fetch brand details.");
        }
      } catch (error) {
        console.error("Error fetching brand:", error);
      }
    });
  });

  // Handle Delete Button Click
  document.querySelectorAll(".btn-delete").forEach((deleteButton) => {
    deleteButton.addEventListener("click", async (e) => {
      const brandId = e.target.closest("tr").dataset.brandId;

      if (confirm("Are you sure you want to delete this brand?")) {
        try {
          const response = await fetch(
            `http://localhost:3000/brands/${brandId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.ok) {
            alert("Brand deleted!");
            location.reload();
          } else {
            const data = await response.json();
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error("Error deleting brand:", error);
        }
      }
    });
  });

  function resetFormFields() {
    brandIdField.value = "";
    brandNameField.value = "";
  }
});
