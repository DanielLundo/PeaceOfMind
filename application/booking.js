// bookings.js
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    const bookButton = document.getElementById('bookButton');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // The initial view (you can choose from various views)
        events: [  // An array of events (you can start with an empty array)
          {
            title: 'Event 1',
            start: '2023-11-01'
          },
          {
            title: 'Event 2',
            start: '2023-11-05'
          }
          // You can add more events here
        ]
      });
      
      calendar.render();
    });
    bookButton.addEventListener('click', async function() {
        // Get selected dates from the calendar

        // Send a request to check availability
        const response = await fetch(`/availability?startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();

        if (data.available) {
            // Dates are available, send a request to create the booking
            const bookingData = { userId, startDate, endDate };
            const bookingResponse = await fetch('/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            if (bookingResponse.status === 201) {
                alert('Booking created successfully');
                // Update the calendar to mark booked dates
            } else {
                alert('Booking creation failed');
            }
        } else {
            alert('Dates are not available');
        }
    });
