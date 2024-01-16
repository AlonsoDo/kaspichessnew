var MiTurno;

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
            // id = Room
            if (Player!=MyName){
                AceptarReto(Player,id);
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
    $('#ContenedorRetos').hide();
    $('#ContenedorTablero').show();
    $('#btCancelarReto').hide();
    $('#btAbortarPartida').show();
    $('#btCrearReto').hide();
    
    if (MyName == data.MyName){
        TiempoPartida = data.Minutes * 60000;
        TiempoRestanteArriba = TiempoPartida;
        TiempoRestanteAbajo = TiempoPartida;
        PlayRoom = data.Room;
        var ColorSide = SortearColor();
        if (ColorSide == 'Blancas'){
            $('#lbRatingOponente').text(data.MyElo);
            $('#lbRatingJugador').text(MyElo);
            StartTimer('Abajo');
            $('#lbRelojOponente').text(FormatearMilisegundos(TiempoPartida));
            $('#lbRelojJugador').text(FormatearMilisegundos(TiempoPartida));
            MiTurno = true;            
            socket.emit('SetValues',{MyName:data.MyName,OpName:data.OpName,Room:data.Room,Color:'Blancas',MyElo:MyElo,Minutes:data.Minutes});            
        }else{ 
            $('#lbRatingOponente').text(data.MyElo);
            $('#lbRatingJugador').text(MyElo);
            StartTimer('Arriba');
            $('#lbRelojOponente').text(FormatearMilisegundos(TiempoPartida));
            $('#lbRelojJugador').text(FormatearMilisegundos(TiempoPartida));           
            MiTurno = false;
            board1.flip();
            socket.emit('SetValues',{MyName:data.MyName,OpName:data.OpName,Room:data.Room,Color:'Negras',MyElo:MyElo,Minutes:data.Minutes});
        }
        $('#lbNombreJugador').text(data.MyName);
        $('#lbNombreOponente').text(data.OpName);
        $('#lbResultadoOponente').text('');
        $('#lbResultadoJugador').text('');
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
    socket.emit('CancelarReto',{MyName:data.OpName})

    $('#btCancelarReto').hide();
    $('#btCrearReto').hide();
    $('#btAbortarPartida').show();
    
    PlayRoom = data.Room;
    TiempoPartida = data.Minutes * 60000;
    TiempoRestanteArriba = TiempoPartida;
    TiempoRestanteAbajo = TiempoPartida;
    if(data.Color == 'Blancas'){
        $('#lbRatingOponente').text(data.MyElo);
        $('#lbRatingJugador').text(MyElo);
        board1.flip();
        MiTurno = false;
        StartTimer('Arriba');
        $('#lbRelojOponente').text(FormatearMilisegundos(TiempoPartida));
        $('#lbRelojJugador').text(FormatearMilisegundos(TiempoPartida));
    }else{
        $('#lbRatingOponente').text(data.MyElo);
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
}