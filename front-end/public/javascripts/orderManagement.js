document.addEventListener("DOMContentLoaded", () => {
  const ordersTableBody = document.querySelector("tbody");

  // Handle the change event on the order status dropdown
  ordersTableBody.addEventListener("change", (e) => {
    if (e.target.classList.contains("order-status")) {
      const orderId = e.target.getAttribute("data-id");
      const newStatus = e.target.value;
      updateOrder(orderId, newStatus);
    }
  });

  // Function to update the order status
  const updateOrder = (orderId, newStatus) => {
    fetch(`http://localhost:3000/orders/admin/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Order status updated successfully!");
        } else {
          alert("Error updating order status.");
        }
      })
      .catch((error) => console.error("Error updating order status:", error));
  };

  // Function to delete an order
  const deleteOrder = (orderId) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this order?"
    );
    if (confirmDelete) {
      fetch(`http://localhost:3000/orders/admin/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Order deleted successfully!");
            fetchAllOrders(); // Refresh the order table after deletion
          } else {
            alert("Error deleting order.");
          }
        })
        .catch((error) => console.error("Error deleting order:", error));
    }
  };

  // Fetch all orders from the API
  const fetchAllOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3000/orders/admin/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const ordersResponse = await response.json();
        const orders = ordersResponse.data;

        // Render orders in the table
        const ordersTableBody = document.querySelector("tbody");
        ordersTableBody.innerHTML = ""; // Clear existing rows

        orders.forEach((order) => {
          const row = document.createElement("tr");

          // Format the prices using JavaScript directly
          const originalPrice = order.totalPrice
            ? parseFloat(order.totalPrice).toFixed(2)
            : "0.00";
          const discountAmount = order.discountAmount
            ? parseFloat(order.discountAmount).toFixed(2)
            : "0.00";
          const finalPrice = order.finalPrice
            ? parseFloat(order.finalPrice).toFixed(2)
            : "0.00";

          row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.User.email || "N/A"}</td>
          <td>${order.orderNumber}</td> <!-- Corrected field name -->
          <td>${
            new Date(order.createdAt).toLocaleDateString() || "Invalid Date"
          }</td>
          <td>${
            new Date(order.updatedAt).toLocaleDateString() || "Invalid Date"
          }</td>
          <td>
            <ul>
              ${order.OrderItems.map(
                (item) =>
                  `<li>Product: ${item.Product.name}, Quantity: ${item.quantity}, Unit Price: $${item.unit_price}</li>`
              ).join("")}
            </ul>
          </td>
          <td>
            Original Price: $${originalPrice}<br>
            Discount: $${discountAmount} (${order.discountPercentage || 0}%)<br>
            Final Price: $${finalPrice}
          </td>
          <td>
            <select class="form-select order-status" data-id="${order.id}">
              <option value="Ordered" ${
                order.status === "Ordered" ? "selected" : ""
              }>Ordered</option>
              <option value="In Progress" ${
                order.status === "In Progress" ? "selected" : ""
              }>In Progress</option>
              <option value="Completed" ${
                order.status === "Completed" ? "selected" : ""
              }>Completed</option>
            </select>
          </td>
          <td>
            <button class="btn btn-danger btn-sm delete-order" data-id="${
              order.id
            }">Delete</button>
          </td>
        `;
          ordersTableBody.appendChild(row);
        });
      } else {
        alert("Failed to fetch all orders.");
      }
    } catch (error) {
      console.error("Error fetching all orders:", error);
    }
  };

  // Delegate the delete action to the table body (to handle dynamically added rows)
  ordersTableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-order")) {
      const orderId = e.target.getAttribute("data-id");
      deleteOrder(orderId);
    }
  });

  // Call fetchAllOrders to load all orders when the page loads
  fetchAllOrders();
});
