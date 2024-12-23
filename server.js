const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname + '/src'));

// MongoDB Connection
const MONGO_URI = 'mongodb+srv://janani:girish@cluster0.e2vk0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Replace with your MongoDB URI
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Schema and Model for Venues
const venueSchema = new mongoose.Schema({
    name: String,
    dateClicked: { type: Date, default: Date.now },
});

const Venue = mongoose.model('Venue', venueSchema);

// API Route to store clicked venue
app.post('/api/venues', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Venue name is required' });
    }

    try {
        const venue = new Venue({ name });
        await venue.save();
        res.status(201).json({ message: 'Venue saved successfully', venue });
    } catch (err) {
        res.status(500).json({ error: 'Error saving venue to the database' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Adjust the path if needed
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
