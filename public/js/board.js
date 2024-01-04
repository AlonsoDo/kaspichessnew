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
            StopTimer('Abajo')
            $('#lbRelojJugador').text('00:00:00');
            $('#ResultMessage').text('You have lost the game by time')
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
        TiempoRestanteArriba = TiempoRestanteArriba + parseInt(SegundosIncremento*1000);
        $('#lbRelojOponente').text(FormatearMilisegundos(TiempoRestanteArriba));                
    }else{
        TiempoRestanteAbajo = TiempoRestanteAbajo - ValorTiempoTranscurrido;
        TiempoRestanteAbajo = TiempoRestanteAbajo + parseInt(SegundosIncremento*1000);
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