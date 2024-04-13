const express = require('express'); 
const app = express(); 
const server = require('http').Server(app); 
const fs = require('fs'); 
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const io = require('socket.io')(server);
const peerServer = ExpressPeerServer(server, {
  debug: true
});

var un, pc;
var unJ, inJ, pcJ;

app.use('/peerjs', peerServer);
app.use(express.static('public'));
app.set('view engine', 'ejs'); 

app.get('/', (req, res) => { 
  res.render('home'); 
})

app.get('/newroom', (req, res) => {
  un = req.query.username;
  pc = req.query.password;
  var roomId = uuidv4();
  fs.appendFileSync("public/logs.txt", roomId + ":" + pc + "\n", "utf-8");
  res.redirect(`/${roomId}`);
})

app.get('/joinroom', (req, res) => {
  unJ = req.query.username;
  inJ = req.query.invitation;
  pcJ = req.query.password;
  var log = fs.readFileSync("public/logs.txt", "utf-8");
  var findInvitation = log.indexOf(inJ + ":" + pcJ);
  if (findInvitation != -1) {
    res.redirect(`/${inJ}`);
    un = unJ,
      pc = pcJ
  } else {
    var findInvitation = log.indexOf(inJ);
    if (findInvitation == -1) {
      res.send("Invalid invitation. Please <a href=/>go back</a>");
    } else {
      var findpassword = log.indexOf(inJ + ":" + pcJ);
      if (findpassword == -1) {
        res.send("Invalid password. Please <a href=/>go back</a>");
      }
    }
  }
});

app.get('/:room', (req, res) => {
  res.render('meet', {
    roomId: req.params.room,
    username: un,
  });
})

app.post('/upload', (req, res) => {
  const fileName = req.headers['file-name'];
  req.on('data', (chunk) => {
    fs.appendFileSync(__dirname + '/public/uploads/' + fileName, chunk);
  })
  res.end('uploaded');
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, peerId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', peerId);
    socket.on('stop-screen-share', (peerId) => {
      io.to(roomId).emit('no-share', peerId);
    })
    socket.on('message', (message, sender, color, time) => {
      io.to(roomId).emit('createMessage', message, sender, color, time);
    })
    socket.on('leave-meeting', (peerId, peerName) => {
      io.to(roomId).emit('user-leave', peerId, peerName);
    })
  })
})

server.listen(process.env.PORT || 80, () => {
  console.log(`listening on port ${process.env.PORT || 80}`)
});