const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://sanjeevani:sanjeeVaniMeds@sanjeevani.exguf.mongodb.net/sanjeevani?retryWrites=true&w=majority&appName=sanjeevani', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define the fertilizer schema and model
const fertilizerSchema = new mongoose.Schema({
    fertilizerName: String,
    composition: [String],
    type: [String], // Array to store types of fertilizers
    soilCategory: String,
    dosage: String,
    use: String,
    environmentalCondition: String,
    efficiency: String,
});

const Fertilizer = mongoose.model('fertilizerData', fertilizerSchema);

// Serve the index.html file at the root route
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle form submissions
app.post('/add-fertilizer', async (req, res) => {
    try {
        const { fertilizerName, composition, type, soilCategory, dosage, use, environmentalCondition, efficiency } = req.body;

        const newFertilizer = new Fertilizer({
            fertilizerName,
            composition,
            type,
            soilCategory,
            dosage,
            use,
            environmentalCondition,
            efficiency,
        });

        await newFertilizer.save();
        res.status(201).send('Fertilizer added successfully!');
    } catch (error) {
        res.status(500).send('Error saving fertilizer: ' + error.message);
    }
});

// Endpoint to fetch all fertilizers
app.get('/fertilizers', async (req, res) => {
    try {
        const fertilizers = await Fertilizer.find();
        res.status(200).json(fertilizers);
    } catch (error) {
        res.status(500).send('Error fetching fertilizers: ' + error.message);
    }
});

// Endpoint to update a fertilizer
app.put('/fertilizers/:id', async (req, res) => {
    const { id } = req.params;
    const { fertilizerName, composition, type, soilCategory, dosage, use, environmentalCondition, efficiency } = req.body;

    try {
        const updatedFertilizer = await Fertilizer.findByIdAndUpdate(id, {
            fertilizerName,
            composition,
            type,
            soilCategory,
            dosage,
            use,
            environmentalCondition,
            efficiency,
        }, { new: true });

        if (!updatedFertilizer) {
            return res.status(404).send('Fertilizer not found.');
        }

        res.status(200).send('Fertilizer updated successfully.');
    } catch (error) {
        res.status(500).send('Error updating fertilizer: ' + error.message);
    }
});

// Endpoint to delete a fertilizer
app.delete('/fertilizers/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFertilizer = await Fertilizer.findByIdAndDelete(id);

        if (!deletedFertilizer) {
            return res.status(404).send('Fertilizer not found.');
        }

        res.status(200).send('Fertilizer deleted successfully.');
    } catch (error) {
        res.status(500).send('Error deleting fertilizer: ' + error.message);
    }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});