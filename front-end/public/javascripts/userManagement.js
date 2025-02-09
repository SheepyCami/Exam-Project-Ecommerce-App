document.addEventListener("DOMContentLoaded", () => {
  const userModal = new bootstrap.Modal(document.getElementById("userModal"));
  const userForm = document.getElementById("userForm");

  // Form fields
  const userIdField = document.getElementById("userId");
  const usernameField = document.getElementById("username");
  const emailField = document.getElementById("email");
  const firstnameField = document.getElementById("firstname");
  const lastnameField = document.getElementById("lastname");
  const roleField = document.getElementById("role");
  const membershipField = document.getElementById("membership");
  const addressField = document.getElementById("address");
  const telephoneField = document.getElementById("telephone");

  let editingUserId = null;

  //Can sign up through the auth endpoint instead

  // Remove the Add User button and functionality
  // const addUserButton = document.getElementById("addUserButton"); // Remove this line
  // addUserButton.addEventListener("click", () => { // Remove this block
  //   editingUserId = null;
  //   resetFormFields();
  //   userModal.show();
  // });

  // Handle Save Button Click (Submit)
  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userData = {
      username: usernameField.value,
      email: emailField.value,
      firstname: firstnameField.value,
      lastname: lastnameField.value,
      address: addressField.value,
      telephone: telephoneField.value,
      RoleId: roleField.value,
      MembershipId: membershipField.value,
    };

    const url = editingUserId
      ? `http://localhost:3000/users/${editingUserId}`
      : null;

    if (!url) return;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in headers
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("User updated successfully!");
        location.reload();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  });

  // Handle Edit Button Click
  document.querySelectorAll(".edit-user-button").forEach((button) => {
    button.addEventListener("click", async () => {
      editingUserId = button.dataset.id;

      try {
        const response = await fetch(
          `http://localhost:3000/users/${editingUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token is sent here
            },
          }
        );

        if (response.ok) {
          const { data } = await response.json();

          // Populate form fields with the user data
          userIdField.value = data.id;
          usernameField.value = data.username;
          emailField.value = data.email;
          firstnameField.value = data.firstname;
          lastnameField.value = data.lastname;
          addressField.value = data.address;
          telephoneField.value = data.telephone;
          roleField.value = data.RoleId;
          membershipField.value = data.MembershipId;

          userModal.show();
        } else {
          alert("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        alert("An error occurred. Please try again.");
      }
    });
  });

  // Handle Delete Button Click
  document.querySelectorAll(".delete-user-button").forEach((deleteButton) => {
    deleteButton.addEventListener("click", async () => {
      const userId = deleteButton.dataset.id;

      if (confirm("Are you sure you want to delete this user?")) {
        try {
          const response = await fetch(
            `http://localhost:3000/users/${userId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`, // Token is sent here as well
              },
            }
          );

          if (response.ok) {
            alert("User deleted successfully!");
            location.reload();
          } else {
            const data = await response.json();
            alert(`Error: ${data.message}`);
          }
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    });

    // Reset form fields
    function resetFormFields() {
      userIdField.value = "";
      usernameField.value = "";
      emailField.value = "";
      firstnameField.value = "";
      lastnameField.value = "";
      roleField.value = "2"; // Default role: User
      membershipField.value = "1"; // Default membership: Basic
      addressField.value = "";
      telephoneField.value = "";
    }
  });
});
