document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const serverMessageDiv = document.getElementById('server-message');

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
                serverMessageDiv.innerHTML = 'Login successful. Redirecting to profile page...';
                setTimeout(() => {                    
                    fetch('/getUserId')
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.href = '/profile/' + data.userId;
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }, 2000);
            } else if (response.status === 401) {
                // Authentication failed
                const data = await response.json();
                serverMessageDiv.innerHTML = data.message;
            }
        } catch (error) {
            console.error(error);
            serverMessageDiv.innerHTML = 'An error occurred during login.';
        }
    });
});
