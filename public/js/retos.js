var MiTurno;

function IniGridRetos(){

    $("#GridRetos").jqGrid({
        datatype:'local',
        colModel:[            
            { label: 'Room', name: 'Room', width: 66, key: true},
            { label: 'Player', name: 'Player', width: 234},            
            { label: 'Rating', name: 'Rating', width: 60},
            { label: 'Time', name: 'Time', width: 66},
            { label: 'Manner', name: 'Manner', width: 72}
        ],
        height:472,
        onSelectRow:function(id){
            var Player = $(this).jqGrid('getCell',id,'Player');
            // id = Room
            if (Player!=MyName){
                AceptarReto(Player,id);
            }else{
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
        PlayRoom = data.Room;
        var ColorSide = SortearColor();
        if (ColorSide == 'Blancas'){
            StartTimer('Abajo');
            $('#lbRelojOponente').text(FormatearMilisegundos(TiempoPartida));
            MiTurno = true;
            socket.emit('SetValues',{MyName:data.MyName,OpName:data.OpName,Room:data.Room,Color:'Blancas'});            
        }else{ 
            StartTimer('Arriba');
            $('#lbRelojJugador').text(FormatearMilisegundos(TiempoPartida));           
            MiTurno = false;
            board1.flip();
            socket.emit('SetValues',{MyName:data.MyName,OpName:data.OpName,Room:data.Room,Color:'Negras'});
        }
        $('#lbNombreJugador').text(data.MyName);
        $('#lbNombreOponente').text(data.OpName);
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
    $('#btCancelarReto').hide();
    $('#btCrearReto').hide();
    $('#btAbortarPartida').show();
    
    PlayRoom = data.Room;
    if(data.Color == 'Blancas'){
        board1.flip();
        MiTurno = false;
        StartTimer('Arriba');
        $('#lbRelojJugador').text(FormatearMilisegundos(TiempoPartida));
    }else{
        MiTurno = true;
        StartTimer('Abajo');
        $('#lbRelojOponente').text(FormatearMilisegundos(TiempoPartida));
    }
    $('#lbNombreJugador').text(data.OpName);
    $('#lbNombreOponente').text(data.MyName);
}