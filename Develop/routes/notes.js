import Router from 'express';
import writeFile from 'fs';



const notesRouter = Router();



// GET Route for retrieving all notes
notesRouter.get('/', (req, res) =>
    readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => {
        console.error('Error reading data from db.json', err);
        res.status(500)
        .json({error: 'Failed to retrieve data from the database'});
    })
);


// POST Route for saving note entries.
notesRouter.post('/', (req, res) => {
  
    const newEntry = {
        title: req.body.title,
        text: req.body.text,
    }
    

    
    
    
});





export default notesRouter;