const expect = require('expect')
const {isRealString} = require('./validation')


describe('isRealString', () => {
  it('should reject non-string values', () => {
    expect(isRealString(123)).toBe(false)
  })
  it('should reject string with only spaces', () => {
    expect(isRealString('  ')).toBe(false)
  })
  expect(isRealString(' hello ')).toBe(true)
})
