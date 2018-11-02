const yargs = require('yargs')
const axios = require('axios')

const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json'
const darkSkyBaseUrl = 'https://api.darksky.net/forecast/17579ffe8d2902ad1001795f10458c9c'

const toCelcius = (temp) => Math.round((temp - 32) * (5/9))

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv


axios.get(geocodeUrl, {
  params: {
    key : 'AIzaSyDHVwa-aIE8N-eK95LOJj-vnr07fh6Fo7c',
    address: argv.address
  }
})
.then(res => {
  if (res.data.status === 'ZERO_RESULTS') throw new Error()
  if (res.status !== 200) throw new Error('Cannot retrieve location')

  const {lat, lng} = res.data.results[0].geometry.location
  return axios.get(`${darkSkyBaseUrl}/${lat},${lng}`)
})
.then(res => {
  const {temperature} = res.data.currently
  console.log(`The current temperature at ${argv.a} is equal to ${toCelcius(temperature)}C.`)
})
.catch(err => {
  if (err.code === 'ENOTFOUND') {
    console.log('Cannot connect to API server')
  } else {
    console.log(err.message)
  }
})
