const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const activityService = require('../services/activity')
const eventService = require('../services/event')

router.get('/activities', auth, async (req, res) => {
  try {
    const activities = await activityService.findByUser(req.user)
    res.send(activities)
  } catch (e) {
    res.status(e.code).send(e.message)
  }
})

router.post('/activity/accept/:id', auth, async (req, res) => {
  try {
    const data = await activityService.accept(req.params.id)
    let response
    if (data.action === 'event') {
      response = await eventService.acceptJoin(data.event, data.user)
    } else if (data.action === 'guide') {
      response = await eventService.changeLeader(data.event, data.leader)
    } else if (data.action === 'finish') {
      response = await eventService.confirmFinish(data.event, data.member)
    }
    res.send(response)
  } catch (e) {
    console.log(e)
    res.status(e.code).send(e.message)
  }
})

router.post('/activity/decline/:id', auth, async (req, res) => {
  try {
    const response = await activityService.decline(req.params.id)
    res.send(response)
  } catch (e) {
    res.status(e.code).send(e.message)
  }
})

module.exports = router