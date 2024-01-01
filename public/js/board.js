function onDrop (source, target, piece, newPos, oldPos, orientation){
    try {
        if (MiTurno){
            chess.move({ from:source, to:target, promotion:'q' });
            socket.emit('SendPos',{source:source,target:target,promotion:'q',PlayRoom:PlayRoom});
            MiTurno = false;
            $('#btAbortarPartida').hide();
            $('#btOfrecerTablas').show();
        }        
    }catch (err) {
        return 'snapback';
    }    
}

function onSnapEnd(){
    board1.position(chess.fen());
}

function SendPosBack(data){
    chess.move({ from:data.source,to:data.target,promotion:data.promotion});
    board1.position(chess.fen());
    MiTurno = true;    
}