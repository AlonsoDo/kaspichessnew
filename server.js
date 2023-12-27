var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

//Default
var Room = 1;
var nContRooms = 1;

io.on('connection', function(socket){

   socket.join('Room' + Room);

   socket.on('CrearReto',function(data){
      console.log('Crear reto');
      var MyName = data.MyName;
      io.emit('CrearRetoBack',{MyName:MyName,Room:nContRooms});
      nContRooms++;
   });   

   //Send this event to everyone in the room.
   io.sockets.in('Room' + Room).emit('ConnectToRoom','Estas en la sala ' + Room);

   socket.on('CambioSala',function(data){
      console.log('Sala anterior: ' + data.SalaAnte);
      socket.leave('Room' + data.SalaAnte)
      console.log('Sala nueva: ' + data.SalaNueva);
      socket.join('Room' + data.SalaNueva);
      //Room = data.SalaNueva;
   });

   socket.on('EnviarChat',function(data){
      console.log(data);
      Room = data.Room
      //io.sockets.in('Room' + Room).emit('EnviarChatBack',data);
      //Send this event to everyone in the room excect the sender.
      socket.broadcast.to('Room' + Room).emit('EnviarChatBack',data);
   });   

})

http.listen(3000, function(){
   console.log('listening on localhost:3000');
});