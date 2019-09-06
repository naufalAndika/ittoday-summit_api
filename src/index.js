require('./db/mongoose')
const express = require('express')
const cors = require('cors')
const userRouter = require('./routers/user')
const mountainRouter = require('./routers/mountain')
const eventRouter = require('./routers/event')
const guideRouter = require('./routers/guide')
const activityRouter = require('./routers/activity')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(guideRouter)
app.use(mountainRouter)
app.use(eventRouter)
app.use(activityRouter)

app.listen(port, () => {
  console.log('server is up on port ' + port)
})
