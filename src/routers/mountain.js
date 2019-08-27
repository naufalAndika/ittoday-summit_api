const express = require('express')
const Mountain = require('../models/mountain')
const router = new express.Router()
const auth = require('../middleware/auth')
// const dbUtils = require('../utils/index').db

router.post('/mountain', async (req, res) => {
  const mountain = new Mountain(req.body)

  try {
    await mountain.save()
    res.status(401).send(mountain)
  } catch (e) {
    res.status(400).send()
  }
})

router.get('/mountain/:id', async (req, res) => {
  try {
    const mountain = await Mountain.findById(req.params.id)

    if (!mountain) {
      res.status(404).send()
    }
    
    res.send(mountain)
  } catch (e) {
    res.status(500).send()
  }
})

// --belom kelar
// router.patch('/mountain', auth, async (req, res) => {
//   const isValidUpdates = dbUtils.checkUpdatesValidity(['name', 'coverImgPath', 'height', 'location', 'content'], Object.keys(req.body))

//   if (!isValidUpdates) {
//     res.status(400).send('Invalid Update')
//   }

  
// })

router.get('/mountain', async (req, res) => {
  try {
    const mountain = await Mountain.findByName(req.query.q)
    res.send(mountain)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/mountains', async (req, res) => {
  try {
    const mountains = await Mountain.find({})
    res.send(mountains)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router