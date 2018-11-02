const fs = require('fs')

let originalNote = {
  title: 'Some title',
  body: 'Some body'
}

let originalNoteString = JSON.stringify(originalNote)

fs.writeFileSync('notes.json', originalNoteString)

var noteString = fs.readFileSync('notes.json')
let note = JSON.parse(noteString)

console.log(note, note.title)
