import Router from 'express';
import fs from 'fs';
import util from 'util';


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


if(title && text) {

    const newEntry = {
        title,
        text,
    }
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
          if (err) {
            console.error(err);
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
    }else{
        res
        .status(500)
        .json('Error in posting new entry.')
    }
    
    
});





export default notesRouter;