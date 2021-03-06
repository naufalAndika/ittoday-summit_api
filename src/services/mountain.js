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

const guides = async (id) => {
  try {
    const mountain = await findById(id)
    await mountain.populate('guides').execPopulate()

    return mountain.guides
  } catch (e) {
    e.throwError()
  }
}

const events = async (id) => {
  try {
    const mountain = await findById(id)
    await mountain.populate('events').execPopulate()
    return mountain.events
  } catch (e) {
    e.throwError()
  }
}

module.exports = {
  create,
  findById,
  findByName,
  list,
  guides,
  events
}