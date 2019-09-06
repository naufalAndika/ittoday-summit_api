const Mountain = require('../models/mountain')
const NotFound = require('../errors/NotFound')

const create = async (data) => {
  const mountain = new Mountain(data)

  try {
    await mountain.save()
    return mountain
  } catch (e) {
    e.throwError()
  }
}

const findById = async (id) => {
  try {
    const mountain = await Mountain.findById(id)
    
    if (!mountain) {
      throw new NotFound('Mountain not found!')
    }
    
    return mountain
  } catch (e) {
    e.throwError()
  }
}

const findByName = async (name) => {
  try {
    const mountain = await Mountain.findByName(name)

    if (!mountain) {
      throw new NotFound('Mountain not found!')
    }

    return mountain
  } catch (e) {
    e.throwError()
  }
}

const list = async () => {
  try {
    const mountains = await Mountain.find({})
    return mountains
  } catch (e) {
    e.throwError()
  }
}

module.exports = {
  create,
  findById,
  findByName,
  list
}