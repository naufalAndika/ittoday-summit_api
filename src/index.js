require('./db/mongoose')
const Mountain = require('./models/mountain')

const mountain = new Mountain({
  name: 'Semeru',
  height: 2800,
  location: 'Probolinggo'
})

const main = async () => {
  try {
    await mountain.save()
    console.log(mountain)
  } catch (e) {
    console.log(e)
  }
}

// main()