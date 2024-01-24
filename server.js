var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var favicon = require('serve-favicon');
var mysql = require('mysql2');

var pool  = mysql.createPool({
  host     : 'uyu7j8yohcwo35j3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user     : 'fzeh0bd62uerjm8m',
  password : 'aqrgaujeb7mbf9i6',
  database : 'ap8pmvpwz7gc4jxd',
  port: '3306',
  connectionLimit : 10
});

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

//Default General Room
var Room = 1;

var nContRooms = 2;

var aRetos = [];

io.on('connection', function(socket){

   socket.join('Room' + Room);

   console.log(socket.id)

   socket.emit('EnviarSocketId',{SocketId:socket.id});

   socket.emit('ActualizarRetos',{aRetos:aRetos});

   //Send this event to everyone in the general room = 1.
   io.sockets.in('Room' + Room).emit('ConnectToRoom','Estas en la sala ' + Room);

   socket.on('TryToLogin',function(data){
      console.log('TryToLogin')
      console.log(data)

      pool.getConnection(function(err,connection){      
         connection.query("SELECT * FROM autentificacion WHERE User='"+data.MyName+"' AND PassWord='"+data.PassWord+"'",function(err,rows){
         if (err){
           console.log('Error: ' + err.message);
           throw err;
         } 
         console.log('Number of rows: '+rows.length);
         // No encuentra al jugador
         if (rows.length==0){
            io.to(socket.id).emit('LoginBack',{Error:true});
         }else{
            io.to(socket.id).emit('LoginBack',{Error:false,Elo:rows[0].Elo});
         }                        
         connection.release();        
         });
      });

   });

   socket.on('CheckPlayer',function(data){
      console.log('CheckPlayer')
      console.log(data)

      pool.getConnection(function(err,connection){      
         connection.query("SELECT * FROM autentificacion WHERE User='"+data.MyName+"'",function(err,rows){
         if (err){
           console.log('Error: ' + err.message);
           throw err;
         } 
         console.log('Number of rows: '+rows.length);
         // No encuentra al jugador
         if (rows.length==0){
            io.to(socket.id).emit('CheckPlayerBack',{found:false});
         }else{
            io.to(socket.id).emit('CheckPlayerBack',{found:true});
         }                        
         connection.release();        
         });
      });

   });

   socket.on('CreateNewAcount',function(data){
      console.log('CreateNewAcount')
      console.log(data)
      
      var date1 = new Date();
      //YYYY-MM-DD format
      var mysqlDate = date1.toISOString().split("T")[0];

      pool.getConnection(function(err,connection){      
         connection.query("INSERT INTO autentificacion(User,PassWord,Email,DateSignUp) VALUES ('"+data.MyName+"','"+data.PassWord+"','"+data.Email+"','"+mysqlDate+"')",function(err,rows){
         if (err){
           console.log('Error: ' + err.message);
           io.to(socket.id).emit('CreateNewAcountBack',{Error:true});
           throw err;
         } 
         io.to(socket.id).emit('CreateNewAcountBack',{Error:false});
         connection.release();        
         });
      });

   });   
   
   socket.on('SendPos',function(data){
      console.log('Play Room: ' + data.PlayRoom)
      //Send this event to everyone in the room excect the sender.
      socket.broadcast.to(data.PlayRoom).emit('SendPosBack',data);
   });

   socket.on('LostByTime',function(data){
      console.log('Play Room: ' + data.PlayRoom)
      //Send this event to everyone in the room excect the sender.
      socket.broadcast.to(data.PlayRoom).emit('WinByTime',data);
   });

   socket.on('LostByResign',function(data){
      console.log('Play Room: ' + data.PlayRoom)
      //Send this event to everyone in the room excect the sender.
      socket.broadcast.to(data.PlayRoom).emit('WinByResign',data);
   });
   
   socket.on('SetValues',function(data){
      console.log(data.Color)
      socket.broadcast.to(data.Room).emit('SetValuesBack',data);
   });
   
   socket.on('AceptarReto',function(data){
      console.log('AceptarReto')
      //console.log('Color: ' + data.Color)
      //console.log(socket.id)
      // Join to Room
      socket.join(data.Room);
      // Join Oponent to room (data.OpName)
      var OpSocketId;
      for (var i = 0; i < aRetos.length; i++){
         if (aRetos[i].MyName == data.OpName){
            OpSocketId = aRetos[i].SocketId;
            console.log(OpSocketId)
            console.log(data.Room)
            io.sockets.sockets.get(OpSocketId).join(data.Room);
            console.log('Oponent ' + OpSocketId + ' join to room: ' + data.Room)            
            io.sockets.in(data.Room).emit('AceptarRetoBack',{MyName:data.MyName,OpName:data.OpName,Room:data.Room,MyElo:aRetos[i].MyElo,Minutes:aRetos[i].Minutes,Seconds:aRetos[i].Seconds,Color:aRetos[i].Color});
            break;
         }
      }

   });
   
   socket.on('CrearReto',function(data){
      console.log('Crear reto');
      var MyName = data.MyName;
      io.emit('CrearRetoBack',{MyName:MyName,Room:nContRooms,MyElo:data.MyElo,Color:data.Color,Minutes:data.Minutes,Seconds:data.Seconds,Rated:data.Rated,Min:data.Min,Max:data.Max});
      console.log(socket.id)
      aRetos.push({MyName:MyName,Room:nContRooms,SocketId:socket.id,MyElo:data.MyElo,Color:data.Color,Minutes:data.Minutes,Seconds:data.Seconds,Rated:data.Rated,Min:data.Min,Max:data.Max})
      nContRooms++;
   }); 
   
   socket.on('CancelarReto',function(data){
      var bRoom;
      console.log(data.MyName)
      // Buscar reto y borrar
      for (var i = 0; i < aRetos.length; i++){
         if (aRetos[i].MyName == data.MyName){            
            bRoom = aRetos[i].Room;
            // Quitar
            aRetos.splice(i,1);
            break;
         }
      }
      io.emit('CancelarRetoBack',{Room:bRoom});
   });
   
   socket.on('SendMensageGeneralChat',function(data){
      console.log(data);
      //Send this event to everyone in the general room = 1.
      io.sockets.in('Room'+Room).emit('SendMensageGeneralChatBack',data);
      
      //Send this event to everyone in the room excect the sender.
      //socket.broadcast.to('Room' + Room).emit('EnviarChatBack',data);
   });
   
   socket.on('disconnect', (reason) => {
      console.log('disconnect')
      console.log(socket.id)
      // Buscar si tiene reto
      var bRoom;
      for (var i = 0; i < aRetos.length; i++){
         if (aRetos[i].SocketId == socket.id){            
            bRoom = aRetos[i].Room;
            // Quitar
            aRetos.splice(i,1);
            break;
         }
      }
      io.emit('CancelarRetoBack',{Room:bRoom});
    });

})

http.listen(process.env.PORT || 3000, function(){
   console.log('listening on localhost:3000');
});