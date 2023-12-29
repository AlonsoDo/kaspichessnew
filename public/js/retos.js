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
            AceptarReto(Player,id);
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
}