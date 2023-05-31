import express from 'express';
import path, {dirname} from 'path';
import notesRouter from './routes/notes.js';
import { fileURLToPath } from 'url';

// ES6 does not have __dirname variable by default.So we use fileULRToPath function 
//from 'url' and import.meta.url to convert the module URL to a file path. 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3001;
const app = express();

//Middleware used for parsing JSOn and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', notesRouter);
app.use(express.static('public'));


// GET Route for note taker homepage.
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/index.html'))
);

// Get route for the notes page.
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/notes.html'))
);

// Wildcard route to handle any undefined routes. Takes user to index.html.
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/pages/index.html'))
);

// Initiate server on specified port.
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);
