const Guide = require('../models/guide')
const userService = require('../services/user')
const mountainService = require('../services/mountain')

const create = async (userData, guideData) => {
  try {
    const response = await userService.create(userData)
    
    const guide = new Guide({
      identityNumber: guideData.identityNumber,
      user: response.user._id     
    })
    await guide.addMountains(guideData.mountains)

    return {
      user: response.user,
      guide,
      token: response.token
    }
  } catch (e) {
    e.throwError()
  } 
}

const list = async () => {
  try {
    const guides = await Guide.find({})
    await Guide.populate(guides, 'user')
    
    return guides
  } catch (e) {
    e.throwError()
  }
}

const findByMountain = async (id) => {
  try {
    const guides = await mountainService.guides(id)
    await Guide.populate(guides, 'user')
    await Guide.populate(guides, {
      path: 'mountains.mountain',
      match: {
        '_id': id.toString()
      }
    })

    return guides
  } catch (e) {
    console.log(e)
    e.throwError()
  }
}

module.exports = {
  create,
  list,
  findByMountain
}