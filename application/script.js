document.addEventListener("DOMContentLoaded", function () {
    // Initialize an object to track available dates
    const availableDates = {};

    const calendar = document.getElementById("calendar");
    const dateInput = document.getElementById("date");
    const bookButton = document.getElementById("book-btn");

    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const messageDiv = document.getElementById('message');

    registrationForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isHouseSitter = document.getElementById('house-sitter').checked; // Check the House sitter checkbox
        const isHomeOwner = document.getElementById('home-owner').checked; // Check the House owner checkbox

        // Create an object to send registration data to the server
        const registrationData = {
            name,
            email,
            password,
            isHouseSitter,
            isHomeOwner,
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

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const loginEmail = document.getElementById('login-email').value;
    });

    // Function to update the calendar grid
    function updateCalendar() {
        calendar.innerHTML = "";
        const startDate = new Date();
        startDate.setDate(1); // Start from the 1st day of the current month
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // Show availability for the current month

        let currentDate = new Date(startDate);
        while (currentDate < endDate) {
            const dateKey = currentDate.toISOString().split('T')[0];
            const cell = document.createElement("div");
            cell.textContent = currentDate.getDate();
            cell.classList.add("calendar-cell");
            
            if (availableDates[dateKey]) {
                cell.classList.add("unavailable");
                cell.setAttribute("title", "Unavailable");
            } else {
                cell.addEventListener("click", () => selectDate(dateKey));
            }

            // Highlight the selected date
            if (dateKey === dateInput.value) {
                cell.classList.add("selected");
            }
            
            calendar.appendChild(cell);
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    // Function to handle date selection
    function selectDate(dateKey) {
        dateInput.value = dateKey;
        bookButton.disabled = false;
        updateCalendar(); // Highlight the selected date
    }

    // Event listener for the book button
    bookButton.addEventListener("click", () => {
        const selectedDate = dateInput.value;
        if (availableDates[selectedDate]) {
            alert(`Sorry, ${selectedDate} is already booked.`);
        } else {
            availableDates[selectedDate] = true;
            dateInput.value = "";
            bookButton.disabled = true;
            updateCalendar();
            alert(`You have successfully booked a house sitter for ${selectedDate}.`);
        }
    });

    // Simulate initial available dates (you can replace this with actual data)
    availableDates["2023-09-25"] = true;
    availableDates["2023-09-27"] = true;
    availableDates["2023-09-30"] = true;

    // Initialize the calendar
    updateCalendar();
});

// Example using the 'fetch' API to send a GET request to the backend
fetch('/api/available-dates')
    .then(response => response.json())
    .then(data => {
        // Handle the data received from the backend
        console.log(data);
    })
    .catch(error => {
        // Handle errors here
        console.error('Error:', error);
    });

fetch('/api/book')
    .then(response => response.json())
    .then(data => {
        // Handle the data received from the backend
        console.log(data);
    })
    .catch(error => {
        // Handle errors here
        console.error('Error:', error);
    });

