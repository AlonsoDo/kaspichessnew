function IniGridRetos(){

    $("#GridRetos").jqGrid({
        datatype:'local',
        colModel:[
            { label: 'Room', name: 'Room', width: 66},
            { label: 'Player', name: 'Player', width: 234},            
            { label: 'Rating', name: 'Rating', width: 60},
            { label: 'Time', name: 'Time', width: 66},
            { label: 'Manner', name: 'Manner', width: 72}
        ],
        height:472,
        onSelectRow:function(id){
            var IdReto = $(this).jqGrid('getCell',id,'Room');
            AceptarReto(IdReto);
        }
    });
      
}

function AceptarReto(IdReto){
    alert(IdReto)
}

