const {MongoClient, ObjectID} = require('mongodb')

const obj = new ObjectID()

console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if (err) return console.log('Unable to connect to mongodb server.')

  console.log('Connected to MongoDB server.')
  const db = client.db('TodoApp')

  //deleteMany
  // db.collection('Todos')
  // .deleteMany({text: 'Walk the cat'})
  // .then(result => {
  //   console.log(result)
  // })

  //deleteOne
  // db.collection('Todos')
  // .deleteOne({text: 'Walk the cat'})
  // .then(result => {
  //   console.log(result)
  // })

  //findOneAndDelete
  // db.collection('Todos')
  // .findOneAndDelete({completed:false})
  // .then(result => {
  //   console.log(result)
  // })

  db.collection('Users')
  .findOneAndDelete({name:'Pieter Du Toit'})
  .then(result => {
    console.log(result)
  })

  db.collection('Users')
  .deleteMany({name:'Hoskins'})
  .then(result => {
    console.log(result)
  })


  // client.close(() => {
  //   console.log('MongoDB connection closed')
  // })
})
