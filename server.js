
const express = require("express");
const app = express();

const io = require('socket.io')(process.env.PORT);

function makeid(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let  i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

let clientRooms = {}; // {client.id, roomName}
let playersInRoom = {}; // {roomName, totalPlayer}
let lastPlayer = {}; // {roomName, lastPlayer}

io.on('connection', client => {

  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);
  client.on('curGame', handleCurrentGame);
  client.on('sendMessage', handleMsg);

  function handleMsg(msg){
    let roomName = clientRooms[client.id];
    io.in(roomName).emit('sentMsg', client.number, msg);
  }

  function handleNewGame(totalPlayer) {
    let roomName = makeid(5); 
    client.number = 1; 

    clientRooms[client.id] = roomName;
    playersInRoom[roomName] = totalPlayer;
    lastPlayer[roomName] = client.number;

    client.emit('gameStatus', roomName, client.number, totalPlayer);

    client.join(roomName);
  }

  function handleJoinGame(roomName) {
    let room = io.sockets.adapter.rooms[roomName];

    let allUsers;
    if (room) {
      allUsers = room.sockets;
    }

    let numClients = 0;
    if (allUsers) {
      numClients = Object.keys(allUsers).length;
    }

    if (numClients === 0) {
      client.emit('unknownCode');
      return;
    } 
    else if (numClients >= playersInRoom[roomName]) { // more people trying to join
      client.emit('roomFull');
      return;
    }
    else if(lastPlayer[roomName] == playersInRoom[roomName]){ // some trying to rejoin after disconneting
      client.emit('roomFull');
      return;
    }

    client.number = lastPlayer[roomName] + 1;

    clientRooms[client.id] = roomName;
    lastPlayer[roomName] = client.number;

    client.emit('gameStatus', roomName, client.number, playersInRoom[roomName]);
    client.to(roomName).emit('connected', client.number);

    client.join(roomName);

    if(lastPlayer[roomName] == playersInRoom[roomName])
        io.in(roomName).emit('lastJoined');
    
  }

  function handleCurrentGame(cell_id) {
    let roomName = clientRooms[client.id];
    io.in(roomName).emit('gameRun', cell_id);
  }

  client.on('disconnect', function() {
      let roomName = clientRooms[client.id]; //console.log(roomName);
      
      if(roomName == undefined) 
        return;

      let room = io.sockets.adapter.rooms[roomName];
      let allUsers;
      if (room) {
        allUsers = room.sockets;
      }
      let numClients = 0; 
      if (allUsers) {
        numClients = Object.keys(allUsers).length;
      } //console.log(numClients);

      if (numClients === 0) { 
        delete playersInRoom[roomName];
        delete lastPlayer[roomName]; 
      } 
      delete clientRooms[client.id];

      client.to(roomName).emit('playerLeft', client.number);
      client.to(roomName).emit('disconnected', client.number);
  });

});


