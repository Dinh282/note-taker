import Router from 'express';
import fs from 'fs'; // 'fs' provides file system operations.
import util from 'util'; //'util' package is for working with promises.
import { v4 as uuidv4 } from 'uuid'; // 'uuid' package is used to generate unique IDs.


const notesRouter = Router(); // creates router object to handle differnet routes.
const readFromFile = util.promisify(fs.readFile); //readFile is Node.js function used to read data from a file asynchronously
//the promisify function of the util module converts callback-based readFile func into promise-based func. 
const writeToFile = util.promisify(fs.writeFile);


// GET Route for retrieving all notes
notesRouter.get('/notes', (req, res) =>
    readFromFile('./db/db.json') //when the '/notes' route is access, it invokes the readFromFile function, which data is read from
    //the defined path of './db/db.json'. 
    .then((data) => res.json(JSON.parse(data))) // .then is chained to promise a return of the parsed data for the readFromFile.
    .catch((err) => { //.catch is chained to catch any error if the promise for readFromFile is rejected.
        console.error('Error reading data from db.json', err);
        res
        .status(500)
        .json({error: 'Failed to retrieve data from the database'});
    })
);


// POST Route for saving note entries.
notesRouter.post('/notes', (req, res) => {
  
const { title, text } = req.body; // destructuring assignment to extract title and text properties form req.body object.

    if( title && text){ // if title and text contains alue, then we execute the readFromfile.
    const newEntry = {  // this newEntry object has an 'id' property with a unique id generate from the uuidv4 function.
        id: uuidv4(),
        title,
        text, 
    }

    readFromFile('./db/db.json')
      .then((data) => {
        const parsedData = JSON.parse(data);
        parsedData.push(newEntry);
        return writeToFile('./db/db.json', JSON.stringify(parsedData));
      })
      .then(() => {
        const response = {
          status: 'success',
          body: newEntry,
        };
        res.json(response);
      })
      .catch((err) => {
        console.error('Error posting note:', err);
        res.status(500).json({ error: 'Error posting note.' });
      });
  } else {
    res.status(500).json({ error: 'Error posting note.' });
  }
});


// DELETE Route for deleting existing note entries
notesRouter.delete('/notes/:id', (req, res) => {
  const { id } = req.params;

  readFromFile('./db/db.json')
    .then((data) => {
      const parsedData = JSON.parse(data).filter((entry) => entry.id !== id);       
      return writeToFile('./db/db.json', JSON.stringify(parsedData));
    })
    .then(() => {
      const response = {
        status: 'success',
        message: 'Note deleted successfully.',
      };
      res.json(response);
    })
    .catch((err) => {
      console.error('Error deleting note:', err);
      res.status(500).json({ error: 'Error deleting note.' });
    });
});


export default notesRouter;