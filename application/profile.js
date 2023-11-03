document.addEventListener('DOMContentLoaded', function () {
    const profilePicture = document.getElementById('profile-picture');
    const userName = document.getElementById('user-name');
    const userAge = document.getElementById('user-age');
    const userDescription = document.getElementById('user-description');
    const editButton = document.getElementById('edit-profile-button');
    const editForm = document.getElementById('edit-profile-form');
    const editFirstname = document.getElementById('edit-firstname');
    const editLastname = document.getElementById('edit-lastname');
    const editAge = document.getElementById('edit-age');
    const editDescription = document.getElementById('edit-description');
    const saveButton = document.getElementById('save-profile-button');

    // Fetch and display user information
    const userId = window.location.pathname.split('/').pop(); // Extract the userId from the URL
    fetch(`/profile/${userId}`)
        .then((response) => response.json())
        .then((userData) => {
            // Update the profile page with userData
            userName.textContent = userData.name; // Assuming 'name' is the user's full name in the response
            userAge.textContent = userData.age; // Assuming 'age' is the user's age in the response
            userDescription.textContent = userData.description; // Assuming 'description' is the user's description in the response

            // You may also need to update profilePicture if it's an image URL in userData
            // profilePicture.src = userData.profilePicture; // Assuming 'profilePicture' is the image URL
        })
        .catch((error) => {
            console.error(error);
            // Handle errors
        });

    // Toggle visibility of edit form
    editButton.addEventListener('click', () => {
        editForm.style.display = 'block';
        editFirstname.value = userName.textContent; // Populate edit fields with current values
        editLastname.value = userAge.textContent;
        editDescription.value = userDescription.textContent;
        userName.style.display = 'none';
        userAge.style.display = 'none';
        userDescription.style.display = 'none';
        editButton.style.display = 'none';
    });

    // Save edited profile
    saveButton.addEventListener('click', async () => {
        // Collect edited data from form fields

        // Send the edited data to the server for saving

        // Update the display with the new user information
        userName.textContent = editFirstname.value + ' ' + editLastname.value;
        userAge.textContent = editAge.value;
        userDescription.textContent = editDescription.value;

        // Toggle visibility back to the view-only mode
        editForm.style.display = 'none';
        userName.style.display = 'block';
        userAge.style.display = 'block';
        userDescription.style.display = 'block';
        editButton.style.display = 'block';
    });
});
