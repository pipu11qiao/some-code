// const express = require('./express-master-copy/')
const express = require('./express-master/')
const app = express()
const port = 3000

const myLogger1 = function (req, res, next) {
  console.log('LOGGED')
  next()
}
const myLogger2 = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger1)

app.use(myLogger2)


const birdsRouter = express.Router()

// middleware that is specific to this router
birdsRouter.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
birdsRouter.get('/', (req, res) => {
  res.send('Birds home page')
})

// define the about route
birdsRouter.get('/about', (req, res) => {
  res.send('About birds')
})
// define the about route
birdsRouter.get('/name/:name', (req, res) => {
  res.send('Name birds')
})

const birdsSmallRouter = express.Router()

birdsSmallRouter.get('/', (req, res) => {
  res.send('Small home page')
})

// define the about route
birdsSmallRouter.get('/about', (req, res) => {
  res.send('About Small')
})
// define the about route
birdsSmallRouter.get('/name/:name', (req, res) => {
  res.send('Name Small')
})

birdsRouter.use('/small', birdsSmallRouter)


app.get('/', function send1(req, res) {
  res.status(300)
  res.send('Hello World!')
  res.send('Hello World!')
})
app.get('/', function send2(req, res) {
  res.send('Hello World!')
  res.send('Hello World!')
})

app.use('/birds', birdsRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})