const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const mysql = require('mysql2');

const port = 3000;

app.use(express.json());
app.use(bodyParser.json());

// Serve static assets (CSS, images, JavaScript)
app.use(express.static(path.join(__dirname)));

// Define routes for your web app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/sitters', (req, res) => {
    res.sendFile(path.join(__dirname, 'sitters.html'));
});

app.get('/regsiter', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Registration
app.post('/register', (req, res) => {
    const { firstname, lastname, email, password, ishomeowner, ishousesitter } = req.body;

    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM user WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        // If a user with the same email exists, return an error
        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password with bcrypt
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Error hashing the password:', hashErr);
                return res.status(500).json({ message: 'Password hashing error' });
            }

            // Insert user data into the database
            const insertUserQuery = 'INSERT INTO user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
            db.query(insertUserQuery, [firstname, lastname, email, hashedPassword, ishomeowner, ishousesitter], (insertErr, result) => {
                if (insertErr) {
                    console.error('Error inserting user data:', insertErr);
                    return res.status(500).json({ message: 'Registration failed' });
                }
                console.log('User registered successfully');
                return res.status(201).json({ message: 'Registration successful' });
            });
        });
    });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Query the database to find the user by email
    const query = 'SELECT * FROM user WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        // Check if a user with the provided email was found
        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Verify the password (you should use a secure password hashing method)
        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Successful login
        return res.status(200).json({ message: 'Login successful', user: user });
    });
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'pom',
    password: 'Pom#1234',
    database: 'peaceofmind',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Close the database connection when the application exits
process.on('SIGINT', () => {
    db.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        }
        console.log('MySQL connection closed');
        process.exit();
    });
});

app.listen(port, () => {
    console.log(`POM server running on port ${port}`);
});