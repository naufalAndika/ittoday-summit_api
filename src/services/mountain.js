const Mountain = require('../models/mountain')

const createMountain = async (data) => {
  const mountain = new Mountain({
    ...data
  })

  try {
    await mountain.save()
    return mountain
  } catch (e) {
    throw e
  }
}

module.exports = {
  createMountain
}