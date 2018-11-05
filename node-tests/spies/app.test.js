const expect = require('expect')
const rewire = require('rewire')

const app = rewire('./app')

describe('App', () => {

  const db = {
    saveUser: expect.createSpy()
  }
  app.__set__('db', db)

  it('should call the spy correctly', () => {
    const spy = expect.createSpy()
    spy('Pieter', 29)
    expect(spy).toHaveBeenCalledWith('Pieter', 29)
  })

  it('should call saveUser with user object', () => {
    const email = 'test@gmail.com'
    const password = '123qwerty'

    app.handleSignup(email, password)
    expect(db.saveUser).toHaveBeenCalledWith({email, password})
  })
})
