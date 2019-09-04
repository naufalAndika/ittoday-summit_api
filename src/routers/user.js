const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const userService = require('../services/user')

router.post('/user', async (req, res) => {
  try {
    const response = await userService.createUser(req.body)
    res.status(201).send(response)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/user/me', auth, async (req, res) => {
  res.send(req.user)
})

router.post('/login', async (req, res) => {
  try {
    const response = await userService.login(req.body.email, req.body.password)
    res.send(response)
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