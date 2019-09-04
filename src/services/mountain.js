const Mountain = require('../models/mountain')

const create = async (data) => {
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

const findById = async (id) => {
  try {
    const mountain = await Mountain.findById(id)
    return mountain
  } catch (e) {
    throw e
  }
}

const findByName = async (name) => {
  try {
    const mountain = await Mountain.findByName(name)
    return mountain
  } catch (e) {
    throw e
  }
}

const list = async () => {
  try {
    const mountains = await Mountain.find({})
    return mountains
  } catch (e) {
    throw e
  }
}

module.exports = {
  create,
  findById,
  findByName,
  list
}