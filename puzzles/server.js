// server.js
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8080;
const puzzlesFilePath = path.join(__dirname, 'puzzles.json');
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// Utility functions to load and save puzzles
function loadPuzzles() {
    if (fs.existsSync(puzzlesFilePath)) {
        const data = fs.readFileSync(puzzlesFilePath);
        return JSON.parse(data);
    }
    return Array.from({ length: 10 }, () => []); // 10 empty sections for each difficulty level
}

function savePuzzles(puzzles) {
    fs.writeFileSync(puzzlesFilePath, JSON.stringify(puzzles, null, 2));
}

// Add new puzzle to a specified difficulty level
app.post('/puzzles', (req, res) => {
    const { difficulty, puzzle } = req.body;
    const puzzles = loadPuzzles();

    if (difficulty < 1 || difficulty > 10) {
        return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    puzzles[difficulty - 1].push(puzzle);
    savePuzzles(puzzles);

    res.status(201).json({ message: 'Puzzle added successfully' });
});

// Get a random puzzle from a specified difficulty level
app.get('/puzzles/random', (req, res) => {
    const difficulty = parseInt(req.query.difficulty, 10);
    const puzzles = loadPuzzles();

    if (difficulty < 1 || difficulty > 10) {
        return res.status(400).json({ error: 'Invalid difficulty level' });
    }

    const selectedPuzzles = puzzles[difficulty - 1];

    if (selectedPuzzles.length === 0) {
        return res.status(404).json({ error: 'No puzzles found for this difficulty level' });
    }

    const randomPuzzle = selectedPuzzles[Math.floor(Math.random() * selectedPuzzles.length)];
    res.json({ puzzle: randomPuzzle });
});

// Check if a specific puzzle exists
app.get('/puzzles/exists', (req, res) => {
    const { puzzle } = req.query;
    const puzzles = loadPuzzles();

    const exists = puzzles.some(section => section.includes(puzzle));
    res.json({ exists });
});

// Delete a puzzle by its position
app.delete('/puzzles/:index', (req, res) => {
    const { index } = req.params;
    const puzzles = loadPuzzles();
    let position = parseInt(index, 10);

    for (let i = 0; i < puzzles.length; i++) {
        if (position < puzzles[i].length) {
            puzzles[i].splice(position, 1);
            savePuzzles(puzzles);
            return res.json({ message: 'Puzzle deleted successfully' });
        }
        position -= puzzles[i].length;
    }

    res.status(404).json({ error: 'Puzzle not found' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});