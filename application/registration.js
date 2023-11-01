document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registration-form');
    const messageDiv = document.getElementById('message');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isHouseSitter = document.getElementById('house-sitter').checked;
        const isHomeOwner = document.getElementById('home-owner').checked;

        // Create an object to send registration data to the server
        const registrationData = {
            firstname,
            lastname,
            email,
            password,
            isHouseSitter,
            isHomeOwner
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
