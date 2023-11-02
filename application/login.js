document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const loginData = {
            email,
            password
        };

        try {
            // Send login data to the server
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.status === 200) {
                // Authentication successful
                messageDiv.innerHTML = 'Login successful. Redirecting to home page...';
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else if (response.status === 401) {
                // Authentication failed
                const data = await response.json();
                messageDiv.innerHTML = data.message;
            }
        } catch (error) {
            console.error(error);
            messageDiv.innerHTML = 'An error occurred during login.';
        }
    });
});
