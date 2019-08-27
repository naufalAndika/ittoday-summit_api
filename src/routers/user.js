const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/user', async (req, res) => {
  const userRole = 1
  const user = new User({
    ...req.body,
    role: userRole
  })

  try{
    await user.save()
    const token = await user.generateToken()

    res.status(201).send({
      user,
      token
    })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/user/me', auth, async (req, res) => {
  res.send(req.user)
})

router.post('/guide', async (req, res) => {
  const guideRole = 2
  const guide = new User({
    ...req.body,
    role: guideRole
  })

  try {
    await guide.save()
    const token = await guide.generateToken()

    res.status(201).send({
      guide,
      token
    })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/guides', async (req, res) => {
  try {
    const guideRole = 2
    const guides = await User.find({
      role: guideRole
    })

    res.send(guides)
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByEmailAndPassword(req.body.email, req.body.password)
    const token = await user.generateToken()

    res.send({
      user,
      token
    })
  } catch (e) {
    res.status(400).send()
  } 
})

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token 
    })
    await req.user.save()
    
    res.send()  
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router