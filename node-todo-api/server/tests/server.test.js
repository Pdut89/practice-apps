const expect = require('expect')
const request = require('supertest')

const {ObjectID} = require('mongodb')
const {app} = require('./../server')

const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')

const {todos, users, populateTodos, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

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

  it('Should return a 400 with invalid id', done => {
    request(app)
      .get('/todos/12345')
      .expect(400)
      .end(done)
  })

  it('Should return a 400 with no matching id', done => {
    request(app)
      .get('/todos/5be0330e78537d8cac5463bf')
      .expect(400)
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


describe('DELETE /todos/:id', () => {
  it('Should remove a todo', done => {
    const hexId = todos[0]._id.toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end((err, res) => {
        if (err) return done(err)

        Todo.findById(hexId).then(todo => {
          expect(todo).toNotExist
          done()
        }).catch(err => {
          done(err)
        })
      })
  })

  it('Should return a 400 if id is not found', done => {
    request(app)
      .delete(`/todos/5be0330e78537d8cac5463bf`)
      .expect(400)
      .end(done)
  })

  it('Should return a 400 if id is invalid', done => {
    request(app)
      .delete(`/todos/12345`)
      .expect(400)
      .end(done)
  })
})

describe('PATCH /todos/:id', () => {
  it('Should update the todo', done => {
    const hexId = todos[0]._id.toHexString()
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: 'My patched todo', completed: true})
      .expect(200)
      .expect(res => {
        const {text, completed} = res.body.todo
        expect(text).toBe('My patched todo')
        expect(completed).toBe(true)
      })
      .end(done)
  })

  it('Should clear completedAt when todo is not completed', done => {
    const hexId = todos[1]._id.toHexString()
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: 'My patched todo', completed: false})
      .expect(200)
      .expect(res => {
        const {text, completed} = res.body.todo
        expect(text).toBe('My patched todo')
      })
      .end(done)
  })
})

describe('GET /users/me', () => {
  it('Should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('Should return a 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body.name).toBe('JsonWebTokenError')
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('Should create a test user', done => {
    const email = 'test@gmail.com'
    const password = '123abc'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy()
        expect(res.body._id).toBeTruthy()
        expect(res.body.email).toBe(email)
      })
      .end(err => {
        if(err) return done(err)

        User.findOne({email})
          .then(user => {
            expect(user).toBeTruthy()
            expect(user.password).not.toBe(password)
            done()
          })
          .catch((err) => {
            done(err)
          })
      })
  })

  it('Should return validation errors if request invalid', done => {
    const email = 'test'
    const password = 'abc'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  })

  it('Should not create user if email in use', done => {
    const email = 'pdut@gmail.com'
    const password = 'abc123'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  })
})
