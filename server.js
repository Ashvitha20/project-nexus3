const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Middleware to serve static files like CSS, images, etc.
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection (update with your own MongoDB URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Mongoose schema for feedback
const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes
app.post('/submit-feedback', (req, res) => {
    const feedback = new Feedback({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
    });

    feedback.save()
        .then(() => res.send('Feedback submitted successfully!'))
        .catch((err) => res.status(400).send('Error submitting feedback'));
});

// Serve frontend HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, '../frontend/about.html')));
app.get('/services', (req, res) => res.sendFile(path.join(__dirname, '../frontend/services.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, '../frontend/contact.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
