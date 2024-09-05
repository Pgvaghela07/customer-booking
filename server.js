// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

// Create Express App
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'piyush@223', // Replace with your MySQL password
    database: 'taxi_booking'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// API to get all bookings
app.get('customer-booking-wojh.onrender.com/api/bookings', (req, res) => {
    const query = 'SELECT * FROM bookings';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// API to create a new booking
app.post('customer-booking-wojh.onrender.com/api/bookings', (req, res) => {
    const { customerName, pickupLocation, dropLocation, pickupDate, pickupTime } = req.body;

    if (!customerName || !pickupLocation || !dropLocation || !pickupDate || !pickupTime) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = `
        INSERT INTO bookings (customerName, pickupLocation, dropLocation, pickupDate, pickupTime)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [customerName, pickupLocation, dropLocation, pickupDate, pickupTime], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Booking created successfully', bookingId: result.insertId });
    });
});

// API to edit a booking
app.put('customer-booking-wojh.onrender.com/api/bookings/:id', (req, res) => {
    const bookingId = req.params.id;
    const { customerName, pickupLocation, dropLocation, pickupDate, pickupTime } = req.body;

    const query = `
        UPDATE bookings 
        SET customerName = ?, pickupLocation = ?, dropLocation = ?, pickupDate = ?, pickupTime = ?
        WHERE id = ?
    `;
    db.query(query, [customerName, pickupLocation, dropLocation, pickupDate, pickupTime, bookingId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Booking updated successfully' });
    });
});

// API to confirm a booking
app.put('customer-booking-wojh.onrender.com/api/bookings/:id/confirm', (req, res) => {
    const bookingId = req.params.id;
    const query = `UPDATE bookings SET status = 'Confirmed' WHERE id = ?`;

    db.query(query, [bookingId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Booking confirmed' });
    });
});

// API to delete a booking
app.delete('customer-booking-wojh.onrender.com/api/bookings/:id', (req, res) => {
    const bookingId = req.params.id;
    const query = `DELETE FROM bookings WHERE id = ?`;

    db.query(query, [bookingId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Booking deleted' });
    });
});

// Serve user.html at /user
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// Serve admin.html at /admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
