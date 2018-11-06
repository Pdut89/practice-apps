const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [
  {text: 'Test todo text'},
  {text: 'Do laundry'}
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
