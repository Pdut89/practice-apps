const expect = require('expect')
const {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = "Pieter"
    const text = "Some message"
    const message = generateMessage(from, text)

    expect(message.from).toBe(from)
    expect(message.text).toBe(text)
    expect(typeof message.createdAt).toBe('number')
  })
})

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = "Pieter"
    const latitude = '1'
    const longitude = '2'
    const message = generateLocationMessage(from, latitude, longitude)

    expect(message.from).toBe(from)
    expect(typeof message.createdAt).toBe('number')
    expect(message.url).toBe('https://www.google.com/maps?q=1,2')
  })
})
