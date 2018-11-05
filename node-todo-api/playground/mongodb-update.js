const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if (err) return console.log('Unable to connect to mongodb server.')

  console.log('Connected to MongoDB server.')
  const db = client.db('TodoApp')

  // findOneAndUpdate
  db.collection('Users')
  .findOneAndUpdate({
    _id: new ObjectID('5be01ee3e2a8558612942ef3')
  }, {
    $set: {
      name: 'Pieter'
    },
    $inc: {
      age: -1
    }
  },{
    returnOriginal: false
  })
  .then(result => {
    console.log(result)
  })


  // client.close(() => {
  //   console.log('MongoDB connection closed')
  // })
})
