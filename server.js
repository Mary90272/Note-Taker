
const express = require('express');
const path = require('path');
const fs = require('fs')

//  unique ids
const uuid = require("./helper/uuid");

const app = express();
const PORT = process.env.PORT || 3001;
//  data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

//API Routes

//GET /api/notes should read the db.json file
app.get('/api/notes', (req, res) => {
  //Read file 
  // return all saved notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
      } else {
        res.json(JSON.parse(data));
      }
});
});

//POST /api/notes 
app.post('/api/notes', (req, res) => {
  //  a POST request
  console.info(`${req.method} request received to add a notes`); 
  //Read db.json and parse it to object
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    var notes = JSON.parse(data);
    // Destructuring assignment for the items in req.body
    let addNote = req.body;
    addNote.id = uuid();
    //Add the request body object to db.json as a new object
    notes.push(addNote);
    //Once new note is added, revert object back to string and write it to db.json
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
      if (err) throw err;
      res.json(notes);
      console.info('Successfully updated notes!')
    });
  }); 
});

//DELETE /api/notes/:id
//query parameter 
// remove the note with the given id property rewrite the notes to the db.json file.
app.delete('/api/notes/:id', (req, res) => {
  // Log that a delete request was received
  console.info(`${req.method} request received to delete a note`);
  //Read db.json and parse it to object
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    //Delete notes 
    notes.forEach(function(thisNote, i) {              
      if (thisNote.id === req.params.id) {
          
          notes.splice(i, 1)            
      }
})
  //Once new note is deleted, revert object back to string and write it to db.json
  fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
    res.json(notes);
    console.info('Successfully delete notes!')
  });
 });
});

// HTML Routes
//GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

//GET * should return the index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Listener
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));