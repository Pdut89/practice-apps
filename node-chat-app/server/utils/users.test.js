const expect = require('expect')

const {Users} = require('./users')

describe('Users', () => {

  beforeEach(() => {
    users = new Users()
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node course'
    },{
      id: '2',
      name: 'Jen',
      room: 'React course'
    },{
      id: '3',
      name: 'Julie',
      room: 'Node course'
    }]
  })

  it('should add a new users', () => {
    const users = new Users()
    const user = {
      id: '123',
      name: 'Pieter',
      room: 'chatroom'
    }
    const resUser = users.addUser(user.id, user.name, user.room)

    expect(users.users).toEqual([user])
  })

  it('should remove a user', () => {
    const user = users.removeUser('1')
    expect(user.id).toBe('1')
    expect(users.users.length).toBe(2)
  })

  it('should not remove a user', () => {
    const user = users.removeUser('4')
    expect(user).toBeFalsy()
    expect(users.users.length).toBe(3)
  })

  it('should find a user', () => {
    const user = users.getUser('1')
    expect(user).toEqual(users.users[0])
  })

  it('should not find a user', () => {
    const user = users.getUser('4')
    expect(user).toBeFalsy()
  })

  it('should return names for Node course', () => {
    const userList = users.getUserList('Node course')
    expect(userList).toEqual(['Mike', 'Julie'])
  })

  it('should return names for React course', () => {
    const userList = users.getUserList('React course')
    expect(userList).toEqual(['Jen'])
  })
})
