function onDrop (source, target, piece, newPos, oldPos, orientation){
    
    try {
        if (MiTurno){
            chess.move({ from:source, to:target, promotion:'q' });
            StopTimer('Abajo');
            socket.emit('SendPos',{source:source,target:target,promotion:'q',PlayRoom:PlayRoom,TiempoRestanteAbajo:TiempoRestanteAbajo});
            MiTurno = false;            
            StartTimer('Arriba');
            $('#btAbortarPartida').hide();
            $('#btOfrecerTablas').show();
            $('#btResign').show();
            
            if (chess.isGameOver()){
                StopTimer('Arriba');
            }
            
            if (chess.isCheckmate()){

                $('#lbResultadoJugador').text('1');
                $('#lbResultadoOponente').text('0');
                var Dif = MyElo - OpElo;
                var Exig = CalcularExigencia(Dif);
                var VarElo = (100 - Exig)/5;
                MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
                MyElo = Math.round(MyElo);
                OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
                OpElo = Math.round(OpElo);                
                $('#ResultMessage').text('You have won the game by CheckMate. You new rating is: ' + MyElo + ' (+' + VarElo + ')')
                $('#DialogMessage').dialog('open'); 

            }else if (chess.isDraw()){

                $('#lbResultadoJugador').text('1/2');
                $('#lbResultadoOponente').text('1/2');
                var Dif = MyElo - OpElo;
                var Exig = CalcularExigencia(Dif);
                var VarElo = (50 - Exig)/5;
                MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
                MyElo = Math.round(MyElo);
                OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
                OpElo = Math.round(OpElo);

                var cVarElo;
                if (VarElo >= 0){
                    cVarElo = '+' + VarElo;
                }else{
                    cVarElo = VarElo;
                }

                if (chess.isInsufficientMaterial()){
                    $('#ResultMessage').text('The game was draw by Insufficient Material. You new rating is: ' + MyElo + ' (' + cVarElo + ')');
                    $('#DialogMessage').dialog('open');
                }else if (chess.isStalemate()){
                    $('#ResultMessage').text('The game was draw by Stalemate. You new rating is: ' + MyElo + ' (' + cVarElo + ')');
                    $('#DialogMessage').dialog('open');
                }else if (chess.isThreefoldRepetition()){
                    $('#ResultMessage').text('The game was draw by Threefold Repetition. You new rating is: ' + MyElo + ' (' + cVarElo + ')');
                    $('#DialogMessage').dialog('open');
                }else{
                    $('#ResultMessage').text('The game was draw by 50-move rule. You new rating is: ' + MyElo + ' (' + cVarElo + ')');
                    $('#DialogMessage').dialog('open');
                }
            }
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
    StopTimer('Arriba');
    TiempoRestanteArriba = data.TiempoRestanteAbajo;
    $('#lbRelojOponente').text(FormatearMilisegundos(TiempoRestanteArriba));
    StartTimer('Abajo');  
    
    if (chess.isGameOver()){
        StopTimer('Abajo');
    }
    
    if (chess.isCheckmate()){

        $('#lbResultadoJugador').text('0');
        $('#lbResultadoOponente').text('1');
        var Dif = MyElo - OpElo;
        var Exig = CalcularExigencia(Dif);
        var VarElo = (0 - Exig)/5;
        MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
        MyElo = Math.round(MyElo);
        OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
        OpElo = Math.round(OpElo);                
        $('#ResultMessage').text('You have lost the game by CheckMate. You new rating is: ' + MyElo + ' (' + VarElo + ')')
        $('#DialogMessage').dialog('open');  

    }else if (chess.isDraw()){

        $('#lbResultadoJugador').text('1/2');
        $('#lbResultadoOponente').text('1/2');
        var Dif = MyElo - OpElo;
        var Exig = CalcularExigencia(Dif);
        var VarElo = (50 - Exig)/5;
        MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
        MyElo = Math.round(MyElo);
        OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
        OpElo = Math.round(OpElo);

        var cVarElo;
        if (VarElo >= 0){
            cVarElo = '+' + VarElo;
        }else{
            cVarElo = VarElo;
        }
        
        if (chess.isInsufficientMaterial()){
            $('#ResultMessage').text('The game was draw by Insufficient Material. You new rating is: ' + MyElo + ' (' + cVarElo + ')');
            $('#DialogMessage').dialog('open');
        }else if (chess.isStalemate()){
            $('#ResultMessage').text('The game was draw by Stalemate. You new rating is: ' + MyElo + ' (' + cVarElo + ')');
            $('#DialogMessage').dialog('open'); 
        }else if (chess.isThreefoldRepetition()){
            $('#ResultMessage').text('The game was draw by Threefold Repetition. You new rating is: ' + MyElo + ' (' + cVarElo + ')');
            $('#DialogMessage').dialog('open');           
        }else{
            $('#ResultMessage').text('The game was draw by 50-move rule. You new rating is: ' + MyElo + ' (' + cVarElo + ')');
            $('#DialogMessage').dialog('open');
        }
    }

}

var TiempoPartida = 300000;
var StartTime = 0;
var MyTimer = null;
var TiempoTranscurrido = 0;
var TiempoRestanteArriba = TiempoPartida;
var TiempoRestanteAbajo = TiempoPartida;
var ValorTiempoTranscurrido = 0;
var SegundosIncremento = 0;

function StartTimer(Posicion) {

    clearInterval(MyTimer);
    StartTime = new Date();
    
    if (Posicion=='Arriba'){
        MyTimer = setInterval( function() { UpdateTimer('Arriba'); } , 50 );        
    }else{
        MyTimer = setInterval( function() { UpdateTimer('Abajo'); } , 50 );        
    }        
  
}

function UpdateTimer(Posicion) {
	
    ValorTiempoTranscurrido = ContadorTiempo();
    
    if (Posicion=='Arriba') {
        $('#lbRelojOponente').text(FormatearMilisegundos(TiempoRestanteArriba - ValorTiempoTranscurrido));         
        if((TiempoRestanteArriba - ValorTiempoTranscurrido)<=0){
            $('#lbRelojOponente').text('00:00:00');    
        }        
    }else{
        $('#lbRelojJugador').text(FormatearMilisegundos(TiempoRestanteAbajo - ValorTiempoTranscurrido));        
        if((TiempoRestanteAbajo - ValorTiempoTranscurrido)<=0){
            socket.emit('LostByTime',{PlayRoom:PlayRoom});
            StopTimer('Abajo')
            $('#btOfrecerTablas').hide();
            $('#btResign').hide();
            $('#lbResultadoJugador').text('0');
            $('#lbResultadoOponente').text('1');
            MiTurno = false;
            $('#lbRelojJugador').text('00:00:00');

            var Dif = MyElo - OpElo;
            var Exig = CalcularExigencia(Dif);
            var VarElo = (0 - Exig)/5;
            MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
            MyElo = Math.round(MyElo);
            OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
            OpElo = Math.round(OpElo);

            $('#ResultMessage').text('You have lost the game by time. You new rating is: ' + MyElo + ' (' + VarElo + ')');
            $('#DialogMessage').dialog('open');            
        }       
    }
    
}

function ContadorTiempo() {

    var TempTime = new Date();
	
    TiempoTranscurrido = TempTime.getTime() - StartTime.getTime();
    
    return TiempoTranscurrido;	   
  
}

function StopTimer(Posicion) {    
    
    clearInterval(MyTimer);
    
    if (Posicion=='Arriba') {
        TiempoRestanteArriba = TiempoRestanteArriba - ValorTiempoTranscurrido;
        TiempoRestanteArriba = TiempoRestanteArriba + parseInt(SegundosIncremento);
        $('#lbRelojOponente').text(FormatearMilisegundos(TiempoRestanteArriba));                
    }else{
        TiempoRestanteAbajo = TiempoRestanteAbajo - ValorTiempoTranscurrido;
        TiempoRestanteAbajo = TiempoRestanteAbajo + parseInt(SegundosIncremento);
        $('#lbRelojJugador').text(FormatearMilisegundos(TiempoRestanteAbajo));                
    }    
    
}

function FormatearMilisegundos(Milisegundos){

    var d=new Date(Milisegundos);	
	
    var hora = (d.getHours()==0)?0:d.getHours()-1;
	
    hora = (hora<10)?""+hora:hora;
    
    var minuto = (d.getMinutes()<10)?""+d.getMinutes():d.getMinutes();
    var segundo = (d.getSeconds()<10)?"0"+d.getSeconds():d.getSeconds();
    var decimas = parseInt((d.getMilliseconds())/100);
	
    if (Milisegundos <= 20000){	
        segundo = (d.getSeconds()<10)?""+d.getSeconds():d.getSeconds();
        return segundo + ":" + decimas;
    }else if (Milisegundos <= 3600000){
        return minuto + ":" + segundo;
    }else{
        minuto = (d.getMinutes()<10)?"0"+d.getMinutes():d.getMinutes();
	return hora + ":" + minuto + ":" + segundo;
    }
        
}

function WinByTime(data){
    $('#btOfrecerTablas').hide();
    $('#btResign').hide();
    $('#lbResultadoJugador').text('1');
    $('#lbResultadoOponente').text('0');

    var Dif = MyElo - OpElo;
    var Exig = CalcularExigencia(Dif);
    var VarElo = (100 - Exig)/5;
    MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
    MyElo = Math.round(MyElo);
    OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
    OpElo = Math.round(OpElo);

    $('#ResultMessage').text('You have won the game by time. You new rating is: ' + MyElo + ' (+' + VarElo + ')');
    $('#DialogMessage').dialog('open'); 
}

function LostByResign(){

    socket.emit('LostByResign',{PlayRoom:PlayRoom});
    
    if (MiTurno){
        StopTimer('Abajo');
    }else{
        StopTimer('Arriba');
    }

    $('#btOfrecerTablas').hide();
    $('#btResign').hide();
    $('#lbResultadoJugador').text('0');
    $('#lbResultadoOponente').text('1');

    var Dif = MyElo - OpElo;
    var Exig = CalcularExigencia(Dif);
    var VarElo = (0 - Exig)/5;
    MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
    MyElo = Math.round(MyElo);
    OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
    OpElo = Math.round(OpElo);

    $('#ResultMessage').text('You have resigned the game. You new rating is: ' + MyElo + ' (' + VarElo + ')')
    $('#DialogMessage').dialog('open');
}

function WinByResign(data){
    if (MiTurno){
        StopTimer('Abajo');
    }else{
        StopTimer('Arriba');
    }

    $('#btOfrecerTablas').hide();
    $('#btResign').hide();
    $('#lbResultadoJugador').text('1');
    $('#lbResultadoOponente').text('0');

    var Dif = MyElo - OpElo;
    var Exig = CalcularExigencia(Dif);
    var VarElo = (100 - Exig)/5;
    MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
    MyElo = Math.round(MyElo);
    OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
    OpElo = Math.round(OpElo);

    $('#ResultMessage').text('You have won the game by resign. You new rating is: ' + MyElo + ' (+' + VarElo + ')')
    $('#DialogMessage').dialog('open');
}