function logoutUser() {

    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Replace 'token' with your cookie name


    window.location.href = 'login.html';
    alert('Logged out successfully'); // You can replace this with your actual logout logic
}
