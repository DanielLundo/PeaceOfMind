document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registration');
    const messageDiv = document.getElementById('message');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const firstname = document.getElementById('firstName').value;
        const lastname = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isHouseSitter = document.getElementById('ishousesitter').checked;
        const isHomeOwner = document.getElementById('ishomeowner').checked;

        // Create an object to send registration data to the server
        const registrationData = {
            firstname,
            lastname,
            email,
            password,
            ishomeowner: isHomeOwner, // Ensure the property names match your server's expectations
            ishousesitter: isHouseSitter,
        };

        try {
            // Send registration data to the server
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();
            messageDiv.innerHTML = data.message;
        } catch (error) {
            console.error(error);
            messageDiv.innerHTML = 'An error occurred during registration.';
        }
    });
});
