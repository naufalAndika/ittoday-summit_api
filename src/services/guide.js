const Guide = require('../models/guide')
const userService = require('../services/user')

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
    throw e
  } 
}

const list = async () => {
  try {
    const guides = await Guide.find({})
    await Guide.populate(guides, 'user')
    
    return guides
  } catch (e) {
    throw e
  }
}

module.exports = {
  create,
  list
}