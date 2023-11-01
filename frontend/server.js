const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const mysql = require('mysql2');

const port = 3000;

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

// Registration
app.post('/register', (req, res) => {
    const { firstname, lastname, email, password, isHouseSitter, isHomeOwner } = req.body;

    // Check if the email is already registered
    if (db.users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash the password before storing it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password' });
        }

        // Store user registration data, including roles
        db.users.push({
            id: db.users.length + 1,
            firstname,
            lastname,
            email,
            password: hashedPassword,
            isHouseSitter,
            isHomeOwner,
        });

        res.status(201).json({ message: 'Registration successful' });
    });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = db.users.find(user => user.email === email);

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password
    bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token for authentication
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
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

app.listen(port, () => {
    console.log(`POM server running on port ${port}`);
});