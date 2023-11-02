const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const mysql = require('mysql2/promise');
const cookieParser = require('cookie-parser');

const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

const db = mysql.createPool({
    host: 'localhost',
    user: 'pom',
    password: 'Pom#1234',
    database: 'peaceofmind',
});

db.getConnection()
    .then((connection) => {
        console.log('Connected to MySQL database');
        connection.release();
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });
    

// Serve static assets (CSS, images, JavaScript)
app.use(express.static(path.join(__dirname)));

// Registration
app.post('/register', async (req, res) => {
    const { firstname, lastname, email, password, ishomeowner, ishousesitter } = req.body;
    console.log(firstname, lastname, email, password, ishousesitter, ishomeowner);

    try {
        // Check if the email already exists in the database
        const [existingUser] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into the database
        const insertUserQuery = 'INSERT INTO user (firstname, lastname, email, password, ishomeowner, ishousesitter) VALUES (?, ?, ?, ?, ?, ?)';
        await db.execute(insertUserQuery, [firstname, lastname, email, hashedPassword, ishomeowner, ishousesitter]);

        console.log('User registered successfully');
        return res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Registration failed' });
    }
});



// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the hashed password from the database based on the email
        const [rows] = await db.execute('SELECT password FROM user WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const hashedPassword = rows[0].password;

        // Use bcrypt.compare to compare the user-entered password with the hashed password
        bcrypt.compare(password, hashedPassword, async(err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (result) {
                // Fetch the user's ID for creating a token
                const [userRow] = await db.execute('SELECT userId FROM user WHERE email = ?', [email]);

                if (!userRow || userRow.length === 0) {
                    return res.status(401).json({ message: 'User not found' });
                }

                const user = userRow[0];

                // Create a token with the user's data
                const token = jwt.sign(user, 'your-secret-key', { expiresIn: '1h' });

                // Set the token in an HTTP cookie
                res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

                return res.status(200).json();
            } else {
                return res.status(401).json({ message: 'Incorrect password' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Profile routes
app.get('/profile/:userId', (req, res) => {
    // Retrieve and send user data for the given userId
    // You'll need to query your database to fetch user information and send it to the profile page.
});

app.put('/profile/:userId', (req, res) => {
    // Update user data for the given userId
    // You'll need to update the user's data in the database based on the changes made in the profile page.
});



process.on('SIGINT', async () => {
    try {
        // Close the MySQL database connection
        await db.end();
        console.log('MySQL connection closed');
    } catch (error) {
        console.error('Error closing MySQL connection:', error);
    } finally {
        // Exit the application
        console.log('Application shut down gracefully');
        process.exit();
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`POM server running on port ${port}`);
});