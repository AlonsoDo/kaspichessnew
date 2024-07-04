var MiTurno;
var IsFliped = false;
var ColorSide;
var OpCountry;
var OpCountryLong;

function IniGridRetos(){

    $("#GridRetos").jqGrid({
        datatype:'local',
        colModel:[            
            { label: 'Room', name: 'Room', width: 66, key: true, hidden: true},            
            { label: 'Color', name: 'Color', width: 58, align: 'center'},
            { label: 'Player', name: 'Player', width: 210, align: 'center'},
            { label: 'Rating', name: 'Rating', width: 48, align: 'center'},
            { label: 'Time', name: 'Time', width: 36, align: 'center'},
            { label: 'Manner', name: 'Manner', width: 60, align: 'center'},
            { label: 'Min', name: 'Min', width: 39, align: 'center'},
            { label: 'Max', name: 'Max', width: 39, align: 'center'}
        ],
        height:472,
        onSelectRow:function(id){
            var Player = $(this).jqGrid('getCell',id,'Player');
            var Min = $(this).jqGrid('getCell',id,'Min');
            var Max = $(this).jqGrid('getCell',id,'Max');
            // id = Room
            if (Player!=MyName){
                if ((Min <= MyElo)  && (Max >= MyElo)){
                    AceptarReto(Player,id);
                }else{
                    $('#ResultMessage').text('Min Max rating is out of range')
                    $('#DialogMessage').dialog('open');
                }
                
            }else{
                // Cambio de color si es mi reto
                $(this).find('.ui-state-highlight').css('background','#80BFFF');
            }            
        }
    });
      
}

function AceptarReto(Player,Room){    
    socket.emit('AceptarReto',{MyName:MyName,OpName:Player,Room:Room});
}

function CancelarRetoBack(data){        
    $('#GridRetos').jqGrid('delRowData',data.Room);
}

function AceptarRetoBack(data){
    
    //var ColorSide;
    var Flag;

    chess.reset();
    board1.position(chess.fen());
        
    //Reset side
    if (IsFliped){
        board1.flip();
        IsFliped = false;
    }

    PrimeraJugada = true;

    if (nSound == 1){
        ion.sound.play('comienzopartida');
    }
    
    Rated = data.Rated;    
    
    $('#ContenedorRetos').hide();
    $('#ContenedorTablero').show();
    $('#btCancelarReto').hide();
    $('#btAbortarPartida').show();
    $('#btCrearReto').hide();
    $('#DivPrivateChat').html('');
    $('#DivGame').html('');
    $('#btMain').hide();
    $('#OfrecerRematch').hide();
    
    if (MyName == data.MyName){        
        TiempoPartida = data.Minutes * 60000;        
        TiempoRestanteArriba = TiempoPartida;
        TiempoRestanteAbajo = TiempoPartida;
        SegundosIncremento = data.Seconds * 1000;
        PlayRoom = data.Room;     

        if (data.Color == 'Random'){
            ColorSide = SortearColor();
        }else if (data.Color == 'White'){
            ColorSide = 'Negras';
        }else if (data.Color == 'Black'){
            ColorSide = 'Blancas';
        }
        
        if (ColorSide == 'Blancas'){
            $('#lbRatingOponente').text(data.MyElo);            
            OpName = data.OpName;
            OpElo = data.MyElo;
            $('#lbRatingJugador').text(MyElo);
            StartTimer('Abajo');
            $('#lbRelojOponente').text(FormatearMilisegundos(TiempoPartida));
            $('#lbRelojJugador').text(FormatearMilisegundos(TiempoPartida));
            MiTurno = true;            
            socket.emit('SetValues',{CountryLong:cCountryLong,Flag:cCountry,MyName:data.MyName,OpName:data.OpName,Room:data.Room,Color:'Blancas',MyElo:MyElo,Minutes:data.Minutes,Seconds:data.Seconds});            
            var Timing = data.Minutes + '/' + data.Seconds;
            socket.emit('RegisterGame',{Status:'Playing',WhiteName:data.MyName,BlackName:data.OpName,WhiteElo:MyElo,BlackElo:OpElo,Timing:Timing,Room:data.Room});
        }else{ 
            $('#lbRatingOponente').text(data.MyElo);
            OpName = data.OpName;
            OpElo = data.MyElo;
            $('#lbRatingJugador').text(MyElo);
            StartTimer('Arriba');
            $('#lbRelojOponente').text(FormatearMilisegundos(TiempoPartida));
            $('#lbRelojJugador').text(FormatearMilisegundos(TiempoPartida));           
            MiTurno = false;
            board1.flip();
            IsFliped = true;
            socket.emit('SetValues',{CountryLong:cCountryLong,Flag:cCountry,MyName:data.MyName,OpName:data.OpName,Room:data.Room,Color:'Negras',MyElo:MyElo,Minutes:data.Minutes,Seconds:data.Seconds});
            var Timing = data.Minutes + '/' + data.Seconds;
            socket.emit('RegisterGame',{Status:'Playing',WhiteName:data.OpName,BlackName:data.MyName,WhiteElo:OpElo,BlackElo:MyElo,Timing:Timing,Room:data.Room});
        }
        $('#lbNombreJugador').text(data.MyName);
        $('#lbNombreOponente').text(data.OpName);
        $('#lbResultadoOponente').text('');
        $('#lbResultadoJugador').text('');
        Flag = data.Flag.toLowerCase();
        OpCountry = Flag;
        $('#ImgFlagOponente').prop('src','res/img/flags/16/'+Flag+'.png?timestamp='+new Date().getTime());
        Flag = cCountry.toLowerCase();
        $('#ImgFlagJugador').prop('src','res/img/flags/16/'+Flag+'.png?timestamp='+new Date().getTime());
        OpCountryLong = data.CountryLong;
        $('#ImgFlagOponente').prop('title',data.CountryLong);
        $('#ImgFlagJugador').prop('title',cCountryLong);

        socket.emit('UpdateStatus',{MyName:data.MyName,MyElo:MyElo,Status:'Playing',PlayRoom:PlayRoom});
        socket.emit('Welcome',{MyName:data.MyName,Welcome:cWelcome,PlayRoom:PlayRoom});
    }
}

function SortearColor(){
    var Cont = Math.floor(Math.random()*2);
    if (Cont == 0){
        return 'Blancas';
    }else{
        return 'Negras';
    }
}

function SetValuesBack(data){
    
    var Flag;

    PrimeraJugada = true;

    chess.reset();
    board1.position(chess.fen());

    //Reset side
    if (IsFliped){
        board1.flip();
        IsFliped = false;
    }

    if (nSound == 1){
        ion.sound.play('comienzopartida');
    }
    
    socket.emit('CancelarReto',{MyName:data.OpName})
    socket.emit('CancelarReto',{MyName:data.MyName})

    $('#btCancelarReto').hide();
    $('#btCrearReto').hide();
    $('#btAbortarPartida').show();
    $('#DivPrivateChat').html('');
    $('#DivGame').html('');
    $('#btMain').hide();
    $('#OfrecerRematch').hide();
    
    PlayRoom = data.Room;
    TiempoPartida = data.Minutes * 60000;
    TiempoRestanteArriba = TiempoPartida;
    TiempoRestanteAbajo = TiempoPartida;
    SegundosIncremento = data.Seconds * 1000;
    //ColorSide = data.Color;
    if(data.Color == 'Blancas'){
        ColorSide = 'Negras';
        $('#lbRatingOponente').text(data.MyElo);
        OpElo = data.MyElo;
        OpName = data.MyName;
        $('#lbRatingJugador').text(MyElo);
        board1.flip();
        IsFliped = true;
        MiTurno = false;
        StartTimer('Arriba');
        $('#lbRelojOponente').text(FormatearMilisegundos(TiempoPartida));
        $('#lbRelojJugador').text(FormatearMilisegundos(TiempoPartida));
    }else{
        ColorSide = 'Blancas';
        $('#lbRatingOponente').text(data.MyElo);
        OpElo = data.MyElo;
        OpName = data.MyName;
        $('#lbRatingJugador').text(MyElo);
        MiTurno = true;
        StartTimer('Abajo');
        $('#lbRelojOponente').text(FormatearMilisegundos(TiempoPartida));
        $('#lbRelojJugador').text(FormatearMilisegundos(TiempoPartida));
    }
    $('#lbNombreJugador').text(data.OpName);
    $('#lbNombreOponente').text(data.MyName);
    $('#lbResultadoOponente').text('');
    $('#lbResultadoJugador').text('');
    Flag = data.Flag.toLowerCase();
    OpCountry = Flag;
    $('#ImgFlagOponente').prop('src','res/img/flags/16/'+Flag+'.png?timestamp='+new Date().getTime());
    Flag = cCountry.toLowerCase();
    $('#ImgFlagJugador').prop('src','res/img/flags/16/'+Flag+'.png?timestamp='+new Date().getTime());
    OpCountryLong = data.CountryLong;
    $('#ImgFlagOponente').prop('title',data.CountryLong);
    $('#ImgFlagJugador').prop('title',cCountryLong);

    socket.emit('UpdateStatus',{MyName:data.OpName,MyElo:MyElo,Status:'Playing',PlayRoom:PlayRoom});
    socket.emit('Welcome',{MyName:data.OpName,Welcome:cWelcome,PlayRoom:PlayRoom});
}

function ActualizarRetos(data){
    console.log(data)
    for (var i = 0; i < data.aRetos.length; i++){
        var RoomReto = data.aRetos[i].Room;        
        jQuery("#GridRetos").jqGrid('addRowData',RoomReto,{Room:RoomReto,Color:data.aRetos[i].Color,Player:data.aRetos[i].MyName,Rating:data.aRetos[i].MyElo,Time:data.aRetos[i].Minutes+'/'+data.aRetos[i].Seconds,Manner:data.aRetos[i].Rated,Min:data.aRetos[i].Min,Max:data.aRetos[i].Max});
    }
}