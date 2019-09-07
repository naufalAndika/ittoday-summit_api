const Guide = require('../models/guide')
const userService = require('../services/user')
const mountainService = require('../services/mountain')
const activityService = require('../services/activity')
const NotFound = require('../errors/NotFound')

const findById = async (id) => {
  try {
    const guide = await Guide.findById(id)
    if (!guide) {
      throw new NotFound('Guide not found!')
    }
    return guide
  } catch (e) {
    e.throwError()
  }
}

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
    console.log(e)
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
    e.throwError()
  }
}

const request = async (id, user, event) => {
  try {
    const guide = await findById(id)
    await activityService.create({
      content: user.name + ' request you!',
      action: 'guide:' + event,
      sender: user,
      receiver: guide.user
    })
    
    await activityService.create({
      content: 'You request a guide!',
      receiver: user
    })

    return {
      message: 'Request sent!'
    }
  } catch (e) {
    e.throwError()
  }
}


module.exports = {
  create,
  list,
  findByMountain,
  request
}