const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// SQLite Database (Persistent File-Based)
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

// Initialize Tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      userID INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      salary REAL NOT NULL,
      date_of_joining DATE NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Offers (
      offerID INTEGER PRIMARY KEY AUTOINCREMENT,
      validity_time INTEGER NOT NULL, -- Number of days
      name_of_offer TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Claims (
      offerID INTEGER NOT NULL,
      userID INTEGER NOT NULL,
      claimed_date DATE NOT NULL,
      expiry_date DATE NOT NULL,
      PRIMARY KEY (offerID, userID),
      FOREIGN KEY (offerID) REFERENCES Offers(offerID),
      FOREIGN KEY (userID) REFERENCES Users(userID)
    )
  `);

  console.log("Tables created successfully!");
});

// Utility function to validate date format
function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

// Utility function to add days to a date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
}

// CRUD Operations for Users
app.post('/users', (req, res) => {
  const { name, age, salary, date_of_joining } = req.body;

  if (!isValidDate(date_of_joining)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  db.run(
    `INSERT INTO Users (name, age, salary, date_of_joining) VALUES (?, ?, ?, ?)`,
    [name, age, salary, date_of_joining],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ userID: this.lastID });
    }
  );
});

app.get('/users', (req, res) => {
  db.all(`SELECT * FROM Users`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM Users WHERE userID = ?`, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(row);
    });
  });

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, salary, date_of_joining } = req.body;
    if (date_of_joining && !isValidDate(date_of_joining)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    db.run(
      `UPDATE Users SET name = ?, age = ?, salary = ?, date_of_joining = ? WHERE userID = ?`,
      [name, age, salary, date_of_joining, id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updated: this.changes });
      }
    );
  });

// CRUD Operations for Offers
app.post('/offers', (req, res) => {
  const { validity_time, name_of_offer, description } = req.body;

  if (!Number.isInteger(validity_time) || validity_time <= 0) {
    return res.status(400).json({ error: 'Validity time must be a positive integer.' });
  }

  db.run(
    `INSERT INTO Offers (validity_time, name_of_offer, description) VALUES (?, ?, ?)`,
    [validity_time, name_of_offer, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ offerID: this.lastID });
    }
  );
});

app.get('/offers', (req, res) => {
  db.all(`SELECT * FROM Offers`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Update an offer by ID
app.put('/offers/:id', (req, res) => {
    const { id } = req.params;
    const { validity_time, name_of_offer, description } = req.body;
  
    // Validate validity_time
    if (validity_time && (!Number.isInteger(validity_time) || validity_time <= 0)) {
      return res.status(400).json({ error: 'Validity time must be a positive integer.' });
    }
  
    db.run(
      `UPDATE Offers SET validity_time = ?, name_of_offer = ?, description = ? WHERE offerID = ?`,
      [validity_time, name_of_offer, description, id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Offer not found.' });
        res.json({ message: 'Offer updated successfully!' });
      }
    );
  });
  

// CRUD Operations for Claims
app.post('/claims', (req, res) => {
  const { offerID, userID, claimed_date } = req.body;

  if (!isValidDate(claimed_date)) {
    return res.status(400).json({ error: 'Invalid claimed date format. Use YYYY-MM-DD.' });
  }

  // Fetch validity_time from Offers table to calculate expiry_date
  db.get(`SELECT validity_time FROM Offers WHERE offerID = ?`, [offerID], (err, offer) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!offer) return res.status(404).json({ error: 'Offer not found.' });

    const { validity_time } = offer;
    const expiry_date = addDays(claimed_date, validity_time);

    db.run(
      `INSERT INTO Claims (offerID, userID, claimed_date, expiry_date) VALUES (?, ?, ?, ?)`,
      [offerID, userID, claimed_date, expiry_date],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Claim added successfully!', expiry_date });
      }
    );
  });
});

// Delete an offer by ID
app.delete('/offers/:id', (req, res) => {
  const { id } = req.params;
  console.log("Deleting offer with ID:", id);

  db.run(`DELETE FROM Offers WHERE offerID = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.json({ message: 'Offer deleted successfully!' });
  });
});

app.get('/claims', (req, res) => {
  db.all(`SELECT * FROM Claims`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Route to get all data from a specific table
app.get('/database/:table', (req, res) => {
  const { table } = req.params;

  // Validate the table name to prevent SQL injection
  const allowedTables = ['Users', 'Offers', 'Claims'];
  if (!allowedTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }
    res.json(rows);
  });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});