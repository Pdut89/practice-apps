const expect = require('expect')
const utils = require('./utils')

describe('Utils', () => {
  it('should add two numbers', () => {
   const res = utils.add(33,11)
   expect(res)
    .toBe(44)
    .toBeA('number')
  })

  it('should async add two numbers', (done) => {
    utils.asyncAdd(10, 15, (sum) => {
      expect(sum)
        .toBe(25)
        .toBeA('number')
      done()
    })
  })

  it('should square a number', () => {
    const res = utils.square(12)
    expect(res)
     .toBe(144)
     .toBeA('number')
  })
})

describe('#add', () => {
  it('should verify first and last names are correct', () => {
    const user = {age:29, location:'South Africa'}
    const res = utils.setName(user, 'Pieter duToit')
    expect(res)
      .toInclude({firstName: 'Pieter'})
      .toInclude({lastName: 'duToit'})
  })
})
