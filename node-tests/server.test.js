const request = require('supertest')
const app = require('./server').app

console.log('here!')

it('should return hello response', (done) => {
  request(app)
    .get('/')
    .expect(200)
    .expect('Hello')
    .end(done)
})
