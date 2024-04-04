const express = require('express')
const app = express()
const server = require('http').Server(app)
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

let username, password

server.listen(process.env.PORT || 8080)
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('frontpage')
})

app.get('/newRoom', (req, res) => {
  username = req.query.username
  password = req.query.password
  let roomId = uuidv4()
  fs.appendFileSync("public/logs.txt", roomId + ":" + password + "\n", "utf-8")
  res.redirect(`/${roomId}`)
})

app.get('/:room', (req, res) => {
  res.render('meeting-room', {
    roomId: req.params.room,
    userName: username
  })
})