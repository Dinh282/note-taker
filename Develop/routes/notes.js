import Router from 'express';
import fs from 'fs'; // 'fs' provides file system operations.
import util from 'util'; //'util' package is for working with promises.
import { v4 as uuidv4 } from 'uuid'; // 'uuid' package is used to generate unique IDs.


const notesRouter = Router();
const readFromFile = util.promisify(fs.readFile);
const writeToFile = util.promisify(fs.writeFile);


// GET Route for retrieving all notes
notesRouter.get('/notes', (req, res) =>
    readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => {
        console.error('Error reading data from db.json', err);
        res
        .status(500)
        .json({error: 'Failed to retrieve data from the database'});
    })
);


// POST Route for saving note entries.
notesRouter.post('/notes', (req, res) => {
  
const { title, text } = req.body;

    if( title && text){
    const newEntry = {
        id: uuidv4(),
        title,
        text, 
    }

    readFromFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        res.status(500).json('Error reading note.');
        } else {
        const parsedData = JSON.parse(data);
        parsedData.push(newEntry);
        writeToFile('./db/db.json', JSON.stringify(parsedData));
        }
    });
     
    const response = {
        status: 'success',
        body: newEntry,
    };

    res.json(response);
    } else {
        res.status(500).json({error: "Error in posting note."})
    }

});


// DELETE Route for deleting existing note entries
notesRouter.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
  
    readFromFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json('Error reading from file.');
      } else {
        let parsedData = JSON.parse(data);
        parsedData = parsedData.filter((entry) => entry.id !== id);
  
        writeToFile('./db/db.json', JSON.stringify(parsedData))
          .then(() => {
            res.json({ status: 'success' });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json('Error deleting note.');
          });
      }
    });
  });


export default notesRouter;