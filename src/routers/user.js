const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')

router.post('/user', async (req, res) => {
  const user = new User(req.body)

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