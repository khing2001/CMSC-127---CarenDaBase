const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;
const path = require('path');

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON
app.use(express.json());

// Connect to SQLite DB
const db = new sqlite3.Database('./CarendaBase_data.db', (err) => {
  if (err) return console.error('DB connection error:', err.message);
  console.log('Connected to the SQLite database.');
});

// Sample route
app.get('/', (req, res) => {
  res.send('Carinderia Inventory API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Middleware
app.use(bodyParser.json());

// POST endpoint to add an ingredient --> localhost:3000/add-ingredient.html 
// POST is for sending data
app.post('/ingredients', (req, res) => {
  const {IngredientName, IngredientType, Unit } = req.body;
  const query = `INSERT INTO Ingredients (IngredientName, IngredientType, Unit) VALUES (?, ?, ?)`;

  db.run(query, [IngredientName, IngredientType, Unit], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Ingredient added!', id: this.lastID });
  });
});

//Adding a GET/ingredients for testing --> localhost:3000/ingredients
// This is for viewing like an ingredient index or something similar to pokedex
// GET is for getting data
app.get('/ingredients', (req, res) => {
  db.all('SELECT * FROM Ingredients', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

//ADDING a GET (getting data from db) for testing --> localhost:3000/orders
app.get('/orders', (req, res) => {
  db.all('SELECT * FROM Orders', (err, rows) => {
    if (err) {
        res.status(500).json({error: err.message});
        return;
    }
    res.json(rows);
  });
});