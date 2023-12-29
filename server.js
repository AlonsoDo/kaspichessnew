var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

//Default General Room
var Room = 1;

var nContRooms = 2;

var aRetos = [];

io.on('connection', function(socket){

   socket.join('Room' + Room);

   console.log(socket.id)

   socket.emit('EnviarSocketId',{SocketId:socket.id});

   //Send this event to everyone in the general room = 1.
   io.sockets.in('Room' + Room).emit('ConnectToRoom','Estas en la sala ' + Room);

   socket.on('AceptarReto',function(data){
      console.log('AceptarReto')
      console.log(socket.id)
      // Join to Room
      socket.join(data.Room);
      // Join Oponent to room (data.OpName)
      var OpSocketId;
      for (var i = 0; i < aRetos.length; i++){
         if (aRetos[i].MyName == data.OpName){
            OpSocketId = aRetos[i].SocketId;
            io.sockets.sockets.get(OpSocketId).join(data.Room);
            console.log('Oponent ' + OpSocketId + ' join to room: ' + data.Room)
            io.sockets.in(data.Room).emit('AceptarRetoBack',{MyName:data.MyName,OpName:data.OpName});
            break;
         }
      }

   });
   
   socket.on('CrearReto',function(data){
      console.log('Crear reto');
      var MyName = data.MyName;
      io.emit('CrearRetoBack',{MyName:MyName,Room:nContRooms});
      console.log(socket.id)
      aRetos.push({MyName:MyName,Room:nContRooms,SocketId:socket.id})
      nContRooms++;
   }); 
   
   socket.on('CancelarReto',function(data){
      var bRoom;
      console.log(data.MyName)
      // Buscar reto y borrar
      for (var i = 0; i < aRetos.length; i++){
         if (aRetos[i].MyName == data.MyName){            
            bRoom = aRetos[i].Room;
            aRetos.splice(i,1);
            break;
         }
      }
      io.emit('CancelarRetoBack',{Room:bRoom});
   });

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