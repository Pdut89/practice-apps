const expect = require('expect')
const request = require('supertest')

const {ObjectID} = require('mongodb')
const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [
  {_id: new ObjectID(), text: 'Test todo text'},
  {_id: new ObjectID(), text: 'Do laundry'}
]

beforeEach(done => {
  Todo.deleteMany({})
  .then(() => {
    return Todo.insertMany(todos)
  })
  .then(() => done())
})

describe('GET /todos', () => {
  it('Should return all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('Should return a specific todo', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('Should return a 404 with invalid id', done => {
    request(app)
      .get('/todos/12345')
      .expect(404)
      .end(done)
  })

  it('Should return a 404 with no matching id', done => {
    request(app)
      .get('/todos/5be0330e78537d8cac5463bf')
      .expect(404)
      .end(done)
  })
})

describe('POST /todos', () => {
  it('Should create a new todo', done => {
    let text = 'Test todo text'

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) return done(err)

        Todo.find().then(todos => {
          expect(todos.length).toBe(3)
          expect(todos[0].text).toBe(text)
          done()
        })
        .catch(err => done(err))
      })
  })

  it('Should not create todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err) => {
        if (err) return done(err)
      })

      Todo.find().then(todos => {
        expect(todos.length).toBe(2)
        done()
      })
      .catch(err => done(err))
  })
})
