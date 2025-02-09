document.addEventListener("DOMContentLoaded", () => {
  const addCategoryButton = document.getElementById("addCategoryButton");
  const categoryModal = new bootstrap.Modal(
    document.getElementById("categoryModal")
  );
  const categoryForm = document.getElementById("categoryForm");

  // Form fields
  const categoryIdField = document.getElementById("categoryId");
  const categoryNameField = document.getElementById("categoryName");

  let editingCategoryId = null;

  // Show modal for adding a category
  addCategoryButton.addEventListener("click", () => {
    editingCategoryId = null;
    resetFormFields();
    categoryModal.show();
  });

  // Handle Save (Add or Edit)
  categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const categoryData = {
      name: categoryNameField.value,
    };

    const method = editingCategoryId ? "PUT" : "POST";
    const url = editingCategoryId
      ? `http://localhost:3000/categories/${editingCategoryId}`
      : "http://localhost:3000/categories";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use injected token
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        alert(editingCategoryId ? "Category updated!" : "Category added!");
        location.reload();
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  });

  // Handle Edit Button Click
  document.querySelectorAll(".btn-edit").forEach((editButton) => {
    editButton.addEventListener("click", async (e) => {
      const categoryRow = e.target.closest("tr");
      editingCategoryId = categoryRow.dataset.categoryId;

      try {
        const response = await fetch(
          `http://localhost:3000/categories/${editingCategoryId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }, // Use injected token
          }
        );

        if (response.ok) {
          const categoryResponse = await response.json();
          const category = categoryResponse.data;

          categoryIdField.value = category.id;
          categoryNameField.value = category.name;

          categoryModal.show();
        } else {
          alert("Failed to fetch category details.");
        }
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    });
  });

  // Handle Delete Button Click
  document.querySelectorAll(".btn-delete").forEach((deleteButton) => {
    deleteButton.addEventListener("click", async (e) => {
      const categoryId = e.target.closest("tr").dataset.categoryId;

      if (confirm("Are you sure you want to delete this category?")) {
        try {
          const response = await fetch(
            `http://localhost:3000/categories/${categoryId}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` }, // Use injected token
            }
          );

          if (response.ok) {
            alert("Category deleted!");
            location.reload();
          } else {
            const data = await response.json();
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error("Error deleting category:", error);
        }
      }
    });
  });

  function resetFormFields() {
    categoryIdField.value = "";
    categoryNameField.value = "";
  }
});
