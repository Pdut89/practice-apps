const jwt = require('jsonwebtoken')

const data = {
  id: 4
}

const token = jwt.sign(data, '123abc')
console.log(token)

const decoded = jwt.verify(token, '123abc')
console.log(decoded)

// const {SHA256} = require('crypto-js')

// const message = 'I am user number 2'
// const hash = SHA256(message).toString()
//

//
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// token.data.id = 5
// token.hash = SHA256(JSON.stringify(data)).toString()
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if (resultHash === token.hash) {
//   console.log('data not changed')
// } else {
//   console.log('data was changed')
// }
