const express = require('express');
const app = express();
const port = 3000;

// Enable JSON parsing
app.use(express.json());

// Define a GET endpoint for /tip
app.get('/tip', (req, res) => {
  // Handle GET request to /tip endpoint
  res.send('Tip Jar API');
});

// Define a POST endpoint for /tip
app.post('/tip', (req, res) => {
  // Handle POST request to /tip endpoint
  const { amount } = req.body;
  console.log(`Received tip of ${amount} SOL`);
  res.send(`Thank you for the tip of ${amount} SOL!`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});




import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);