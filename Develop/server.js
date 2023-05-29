import express from 'express';
import path from 'path';
import api from './routes/api.js';

const PORT =process.env.PORT || 3001;
const app = express();

//Middleware used for parsing JSOn and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);
app.use(express.static('public'));


// GET Route for note taker homepage.
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/index.html'))
);

// Get route for the notes page.
app.get('/feedback', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/notes.html'))
);

// Wildcard route to handle any undefined routes. Takes user to 404 page.
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/404.html'))
);

// Initiate server on specified port.
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);
