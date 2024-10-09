const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoute');

mongoose.connect('mongodb://localhost:27017/mydatabase');

app.use(express.json());
app.use('/users', userRoute);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});




import React from 'react';
import Header from './Header';

const App = () => {
  return (
    <div>
      <Header />
      {/* Add more components here */}
    </div>
  );
};

export default App;