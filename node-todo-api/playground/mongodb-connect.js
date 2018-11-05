const {MongoClient} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if (err) return console.log('Unable to connect to mongodb server.')

  console.log('Connected to MongoDB server.')
  const db = client.db('TodoApp')

  db.collection('Todos').insertOne({
    text: 'Walk the cat',
    completed: false
  }, (err, result) => {
    if (err) return console.log('Unable to insert todo')
    console.log(JSON.stringify(result))
    console.log(JSON.stringify(result.ops, undefined, 2))
  })

  // db.collection('Users').insertOne({
  //   name: 'Hoskins',
  //   age: 31,
  //   location: 'UK'
  // }, (err, result) => {
  //   if (err) return console.log('Unable to insert user')
  //
  //   console.log(JSON.stringify(result.ops[0], undefined, 2))
  // })

  client.close(() => {
    console.log('MongoDB connection closed')
  })
})
