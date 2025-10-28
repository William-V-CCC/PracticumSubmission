const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

let batSignalStatus = false; // Default OFF

// Pre-computed hash for "JimGordan"
const VALID_HASH = crypto.createHash('sha256').update("JimGordan").digest('hex');

// Middleware
app.use(express.json());

// Toggle function (pure & testable)
function ToggleSignal(action, key) {
    // Validate key first
    if (!key || crypto.createHash('sha256').update(key).digest('hex') !== VALID_HASH) {
        return { success: false, status: 403, message: "Access denied. Only Commissioner Gordon can activate the Bat-signal!" };
    }

    if (action === 'ON') {
        batSignalStatus = true;
        return { success: true, status: 200, message: "The Bat-signal is now ON. Batman is on his way!" };
    } else if (action === 'OFF') {
        batSignalStatus = false;
        return { success: true, status: 200, message: "The Bat-signal is now OFF. Gotham is safe... for now." };
    } else {
        return { success: false, status: 400, message: "Invalid action. Use 'ON' or 'OFF'." };
    }
}

// Default route
app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the Batman API! Use /batsignal to check or toggle Bat-signal.",
        endpoints: {
            "GET /batsignal": "Check if the Bat-signal is ON or OFF.",
            "POST /batsignal": "Toggle the Bat-signal ON or OFF. Requires valid 'key'.",
            "GET /batsignal/photo": "Get a Batman photo if the signal is ON. Requires valid 'key'."
        }
    });
});

// GET route to check Bat-signal status
app.get('/batsignal', (req, res) => {
    res.json({
        status: batSignalStatus ? "ON" : "OFF",
        message: batSignalStatus
            ? "The Bat-signal is shining brightly!"
            : "The Bat-signal is currently off."
    });
});

// POST route to toggle Bat-signal
app.post('/batsignal', (req, res) => {
    const { action, key } = req.body;
    const result = ToggleSignal(action, key);
    res.status(result.status).json(result);
});

// GET route for photo
app.get('/batsignal/photo', (req, res) => {
    const { key } = req.query;

    if (!key || crypto.createHash('sha256').update(key).digest('hex') !== VALID_HASH) {
        return res.status(403).json({ success: false, message: "Access denied. Only Commissioner Gordon can view this page!" });
    }

    if (!batSignalStatus) {
        return res.status(400).json({ success: false, message: "The Bat-signal is OFF. No Batman to show!" });
    }

    const imagesDir = path.join(__dirname, './assets/');
    const files = fs.readdirSync(imagesDir).filter(file =>
        file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );

    if (files.length === 0) {
        return res.status(500).json({ success: false, message: "No Batman photos found!" });
    }

    const uniqueFiles = [...new Set(files)];
    const randomPhoto = uniqueFiles[Math.floor(Math.random() * uniqueFiles.length)];
    const photoPath = path.join(imagesDir, randomPhoto);
    res.sendFile(photoPath);
});

// Only start the server if not running tests
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Batman API is running on http://localhost:${port}`));
}

module.exports = { app, ToggleSignal, VALID_HASH };
exports.default = app; // Default export for Jest compatibility
