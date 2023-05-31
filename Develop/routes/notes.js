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

    readFromFile('./db/db.json') //read data in the db.json file then we parse the data before pushing newEntry to it.
      .then((data) => {
        const parsedData = JSON.parse(data);
        parsedData.push(newEntry);
        return writeToFile('./db/db.json', JSON.stringify(parsedData)); // we then write the stringified data
        // to the file before returning it. 
      })
      .then(() => { // if the readFromFile and writeToFile are fullfilled, we send a JSON response.
        const response = {
          status: 'success',
          body: newEntry,
        };
        res.json(response);
      })
      .catch((err) => { //here we catch any error and respond with the status of 500 and send a JSON message. 
        console.error('Error posting note:', err);
        res.status(500).json({ error: 'Error posting note.' });
      });
  } else {
    res.status(500).json({ error: 'Error posting note.' });
  }
});


// DELETE Route for deleting existing note entries
notesRouter.delete('/notes/:id', (req, res) => {
  const { id } = req.params; // req.params represents parameters extract from the route path.

  readFromFile('./db/db.json')
    .then((data) => {
      const parsedData = JSON.parse(data).filter((entry) => entry.id !== id); // data read form the .json file is
      //parsed and filtered to exclude the entry with specified  id.       
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