console.log('Starting app.')

const fs = require('fs')
const notes = require('./notes.js')
const yargs = require('yargs')

const _ = require('lodash')

const logNote = (note) => {
  console.log(`Title: ${note.title}, Body: ${note.body}`)
}

const titleOptions = {
  describe: "Title of note",
  demand: true,
  alias: 't'
}

const bodyOptions = {
  describe: "Body of note",
  demand: true,
  alias: 'b'
}

const argv = yargs
  .command('add', 'Add a new note', {
    title: titleOptions,
    body: bodyOptions
  })
  .command('list', 'List all notes')
  .command('read', 'Read a note', {
    title: titleOptions
  })
  .command('remove', 'Remove a note', {
    title: titleOptions
  })
  .help()
  .argv
  
const command = process.argv[2]

if (command === 'add') {
  const note = notes.addNote(argv.title, argv.body)
  if (note) {
    logNote(note)
  } else {
    console.log('That note already exists')
  }
} else if (command === 'list') {
  const notesList = notes.getAll()
  notesList.forEach(note => {
    logNote(note)
  })
} else if(command === "read") {
  const note = notes.getNote(argv.title)
  const message = note ? logNote(note) : console.log('Note not found')

} else if(command === "remove") {
  const removed = notes.removeNote(argv.title)
  const message = removed ? 'Note removed' : 'Note not found'
  console.log(message)
} else {
  console.log('Command not recognised')
}
