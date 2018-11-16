const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {SHA256} = require('crypto-js')

const password = '123abc'

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  })
})

const hashedPassword = '$2a$10$WMklf/pl4ej9wjUilZI6B.bLb2SUvB29jhW.dDKlCsDyN2DHQbpXa'

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res)
})

//
// const data = {
//   id: 4
// }
//
// const token = jwt.sign(data, '123abc')
// console.log(token)
//
// const decoded = jwt.verify(token, '123abc')
// console.log(decoded)







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
