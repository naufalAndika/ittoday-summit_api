require('./db/mongoose')
const express = require('express')
const userRouter = require('./routers/user')
const mountainRouter = require('./routers/mountain')
const eventRouter = require('./routers/event')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(mountainRouter)
app.use(eventRouter)

app.listen(port, () => {
  console.log('server is up on port ' + port)
})
