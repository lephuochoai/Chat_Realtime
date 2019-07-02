const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const path = require('path');
app.use(cors());
const User = require('./api/models/user.model')

const indexRouter = require('./api/routes/index');
const usersRouter = require('./api/routes/users');

const mongoose = require('mongoose');
const PASS_MONGO = require('./config/passMongoDB.config')

const socketIo = require('socket.io');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', indexRouter);
app.use('/api/user', usersRouter);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://phuochoaile:'+PASS_MONGO.pass+'@cluster0-2bf5c.mongodb.net/chat_realtime', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

const io = socketIo(http);

let arrUserDaDangKy = [];

User.find({}, (err, doc) => {
  if(err) console.log('Loi khi lay DS user');
  doc.map(user => {
    arrUserDaDangKy.push(user);
  })
})
let arrUserDangOnline = [];

io.on("connection", socket => {
  console.log("Co nguoi ket noi:" + socket.id);
  socket.on("disconnect", function(){
    console.log(socket.id + " ngat ket noi!!!!!");
  });
  // socket.on('addUser', (data) => {
  //   arrUserDaDangKy.push(data);
  //   socket.emit('sendUser',data);
  // })
  socket.on('userLoginOnline', async data => {
    // arrUserDangOnline.push(data);
    console.log('AAAA ->' + data);
    
    await User.findById(data, async (err, doc) => {
      if(err) {
        console.log(err);        
      }
      console.log(doc);      
      await arrUserDangOnline.push(doc);
    })
  })
  socket.on('sendID', data => {
    console.log('Kiem tra user '+data+' co dang ky chua?');
    // if(arrUserDangOnline.indexOf(data) > -1) {
      socket.emit('receiveUser', {
        arrUserDangOnline: arrUserDangOnline,
        arrUserDaDangKy: arrUserDaDangKy
      });
    // }
  })
});

http.listen(3000, () => {
  console.log('Run server on port 3000');    
})