const fs = require('fs');

const fetchNotes = () => {
  try {
    const notesString = fs.readFileSync('notes-data.json');
    return JSON.parse(notesString);
  } catch (e) {
    return [];
  }
};

var saveNotes = (notes) => {
  fs.writeFileSync('notes-data.json', JSON.stringify(notes));
};

const addNote = (title, body) => {
  const notes = fetchNotes();
  const note = {title, body };
  const duplicateNotes = notes.filter((note) => note.title === title);

  if (!duplicateNotes.length) {
    notes.push(note);
    saveNotes(notes);
    return note;
  }
};

const getAll = () => {
  return fetchNotes()
};

const getNote = (title) => {
  const notes = fetchNotes()
  return notes.find(note => note.title === title)
};

const removeNote = (title) => {
  const notes = fetchNotes()
  const filteredNotes = notes.filter(note => note.title !== title)
  saveNotes(filteredNotes)
  return filteredNotes.length < notes.length
};

module.exports = {
  addNote,
  getAll,
  getNote,
  removeNote
};
