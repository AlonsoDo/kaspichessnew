var OfreciendoTablas = false;

function onDrop (source, target, piece, newPos, oldPos, orientation){
    
    var VarElo;
    
    try {
        if (MiTurno){

            if (nSound == 1){
                ion.sound.play('move');
            }
            
            chess.move({ from:source, to:target, promotion:'q' }); 
            StopTimer('Abajo');
            socket.emit('SendPos',{source:source,target:target,promotion:'q',PlayRoom:PlayRoom,TiempoRestanteAbajo:TiempoRestanteAbajo});
            MiTurno = false;            
            StartTimer('Arriba');
            $('#btAbortarPartida').hide();
            $('#btOfrecerTablas').show();
            $('#btResign').show();
            $('#DeclinarTablas').hide();
            DrawGame();

            if (OfreciendoTablas){
                OfreciendoTablas = false;
                DeclinarTablas(); 
            }
            
            if (chess.isGameOver()){
                StopTimer('Arriba');
                $('#btOfrecerTablas').hide();
                $('#btResign').hide();
                $('#btMain').show();
                ResetBotones();                
            }
            
            if (chess.isCheckmate()){                

                if (nSound == 1){
                    ion.sound.play('win');
                }
                
                $('#lbResultadoJugador').text('1');
                $('#lbResultadoOponente').text('0');

                if (Rated == 'Rated'){
                    var Dif = MyElo - OpElo;
                    var Exig = CalcularExigencia(Dif);
                    VarElo = (100 - Exig)/5;
                    MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
                    MyElo = Math.round(MyElo);
                    OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
                    OpElo = Math.round(OpElo); 
                }else{
                    VarElo = 0;
                }
                
                socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:100});

                var Resultado;
                if (Turno() == 'White'){
                    Resultado = '1-0';
                }else{
                    Resultado = '0-1';
                }
                socket.emit('UpdateStatusGame',{Resultado:Resultado,GameId:GameId});

                $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">' + Resultado + '</label>');
                
                $('#ResultMessage').text('You have won the game by CheckMate. Your new rating is: ' + MyElo + ' (+' + VarElo + ')')
                $('#DialogMessage').dialog('open');                 

            }else if (chess.isDraw()){

                if (nSound == 1){
                    ion.sound.play('draw');
                }

                $('#lbResultadoJugador').text('1/2');
                $('#lbResultadoOponente').text('1/2');

                if (Rated == 'Rated'){
                    var Dif = MyElo - OpElo;
                    var Exig = CalcularExigencia(Dif);
                    VarElo = (50 - Exig)/5;
                    MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
                    MyElo = Math.round(MyElo);
                    OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
                    OpElo = Math.round(OpElo);
                }else{
                    VarElo = 0;
                }

                socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:50});
                socket.emit('UpdateStatusGame',{Resultado:'1/2-1/2',GameId:GameId});

                $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">1/2-1/2</label>');
                
                var cVarElo;
                if (VarElo >= 0){
                    cVarElo = '+' + VarElo;
                }else{
                    cVarElo = VarElo;
                }

                if (chess.isInsufficientMaterial()){
                    $('#ResultMessage').text('The game was draw by Insufficient Material. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
                    $('#DialogMessage').dialog('open');
                }else if (chess.isStalemate()){
                    $('#ResultMessage').text('The game was draw by Stalemate. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
                    $('#DialogMessage').dialog('open');
                }else if (chess.isThreefoldRepetition()){
                    $('#ResultMessage').text('The game was draw by Threefold Repetition. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
                    $('#DialogMessage').dialog('open');
                }else{
                    $('#ResultMessage').text('The game was draw by 50-move rule. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
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

    var VarElo;

    if (nSound == 1){
        ion.sound.play('move');
    }
    
    chess.move({ from:data.source,to:data.target,promotion:data.promotion});
    board1.position(chess.fen());
    MiTurno = true; 
    StopTimer('Arriba');
    TiempoRestanteArriba = data.TiempoRestanteAbajo;
    $('#lbRelojOponente').text(FormatearMilisegundos(TiempoRestanteArriba));
    StartTimer('Abajo');  
    DrawGame();
    
    if (chess.isGameOver()){
        StopTimer('Abajo');
        $('#btOfrecerTablas').hide();
        $('#btResign').hide();
        $('#btMain').show();
        ResetBotones();        
    }
    
    if (chess.isCheckmate()){

        if (nSound == 1){
            ion.sound.play('lost');
        }

        $('#lbResultadoJugador').text('0');
        $('#lbResultadoOponente').text('1');

        if (Rated == 'Rated'){
            var Dif = MyElo - OpElo;
            var Exig = CalcularExigencia(Dif);
            VarElo = (0 - Exig)/5;
            MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
            MyElo = Math.round(MyElo);
            OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
            OpElo = Math.round(OpElo);
        }else{
            VarElo = 0;
        } 
        
        socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:0});

        var Resultado;
        if (Turno() == 'White'){
            Resultado = '1-0';
        }else{
            Resultado = '0-1';
        }
        $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">' + Resultado + '</label>');
                
        $('#ResultMessage').text('You have lost the game by CheckMate. Your new rating is: ' + MyElo + ' (' + VarElo + ')')
        $('#DialogMessage').dialog('open');  

    }else if (chess.isDraw()){

        if (nSound == 1){
            ion.sound.play('draw');
        }

        $('#lbResultadoJugador').text('1/2');
        $('#lbResultadoOponente').text('1/2');

        if (Rated == 'Rated'){
            var Dif = MyElo - OpElo;
            var Exig = CalcularExigencia(Dif);
            VarElo = (50 - Exig)/5;
            MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
            MyElo = Math.round(MyElo);
            OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
            OpElo = Math.round(OpElo);
        }else{
            VarElo = 0;
        }

        socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:50});

        $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">1/2-1/2</label>');
        
        var cVarElo;
        if (VarElo >= 0){
            cVarElo = '+' + VarElo;
        }else{
            cVarElo = VarElo;
        }
        
        if (chess.isInsufficientMaterial()){
            $('#ResultMessage').text('The game was draw by Insufficient Material. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
            $('#DialogMessage').dialog('open');
        }else if (chess.isStalemate()){
            $('#ResultMessage').text('The game was draw by Stalemate. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
            $('#DialogMessage').dialog('open'); 
        }else if (chess.isThreefoldRepetition()){
            $('#ResultMessage').text('The game was draw by Threefold Repetition. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
            $('#DialogMessage').dialog('open');           
        }else{
            $('#ResultMessage').text('The game was draw by 50-move rule. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
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

    var VarElo;
	
    ValorTiempoTranscurrido = ContadorTiempo();
    
    if (Posicion=='Arriba') {
        $('#lbRelojOponente').text(FormatearMilisegundos(TiempoRestanteArriba - ValorTiempoTranscurrido));         
        if((TiempoRestanteArriba - ValorTiempoTranscurrido)<=0){
            $('#lbRelojOponente').text('00:00:00');    
        }        
    }else{
        $('#lbRelojJugador').text(FormatearMilisegundos(TiempoRestanteAbajo - ValorTiempoTranscurrido));        
        if((TiempoRestanteAbajo - ValorTiempoTranscurrido)<=0){
            // Fin de tiempo
            // Comprobar tablas por rey solo
            if (KingAlone(Turno())){
                
                StopTimer('Abajo')
                $('#btOfrecerTablas').hide();
                $('#btResign').hide();
                $('#btMain').show();
                ResetBotones();
                if (nSound == 1){
                    ion.sound.play('draw');
                }
                $('#lbResultadoJugador').text('1/2');
                $('#lbResultadoOponente').text('1/2');
                MiTurno = false;
                $('#lbRelojJugador').text('00:00:00');

                if (Rated == 'Rated'){
                    var Dif = MyElo - OpElo;
                    var Exig = CalcularExigencia(Dif);
                    VarElo = (50 - Exig)/5;
                    MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
                    MyElo = Math.round(MyElo);
                    OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
                    OpElo = Math.round(OpElo);
                }else{
                    VarElo = 0;
                }

                socket.emit('DrawByTime',{PlayRoom:PlayRoom});
                socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:50});
                socket.emit('UpdateStatusGame',{Resultado:'1/2-1/2',GameId:GameId});

                $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">' + Resultado + '</label>');
        
                $('#ResultMessage').text('The game was draw for insufficient material. Your new rating is: ' + MyElo + ' (' + VarElo + ')');
                $('#DialogMessage').dialog('open');
            }else{            
                
                StopTimer('Abajo')
                $('#btOfrecerTablas').hide();
                $('#btResign').hide();
                $('#btMain').show();
                ResetBotones();
                if (nSound == 1){
                    ion.sound.play('lost');
                }
                $('#lbResultadoJugador').text('0');
                $('#lbResultadoOponente').text('1');
                MiTurno = false;
                $('#lbRelojJugador').text('00:00:00');

                if (Rated == 'Rated'){
                    var Dif = MyElo - OpElo;
                    var Exig = CalcularExigencia(Dif);
                    VarElo = (0 - Exig)/5;
                    MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
                    MyElo = Math.round(MyElo);
                    OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
                    OpElo = Math.round(OpElo);
                }else{
                    VarElo = 0;
                }

                socket.emit('LostByTime',{PlayRoom:PlayRoom});
                socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:0});

                var Resultado;
                if (Turno() == 'White'){
                    Resultado = '1-0';
                }else{
                    Resultado = '0-1';
                }
                socket.emit('UpdateStatusGame',{Resultado:Resultado,GameId:GameId});

                $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">' + Resultado + '</label>');
        
                $('#ResultMessage').text('You have lost the game by time. Your new rating is: ' + MyElo + ' (' + VarElo + ')');
                $('#DialogMessage').dialog('open');
            }
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
    
    var VarElo;
    
    $('#btOfrecerTablas').hide();
    $('#btResign').hide();
    $('#btMain').show();
    ResetBotones();

    if (nSound == 1){
        ion.sound.play('win');
    }
    
    $('#lbResultadoJugador').text('1');
    $('#lbResultadoOponente').text('0');

    if (Rated == 'Rated'){
        var Dif = MyElo - OpElo;
        var Exig = CalcularExigencia(Dif);
        VarElo = (100 - Exig)/5;
        MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
        MyElo = Math.round(MyElo);
        OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
        OpElo = Math.round(OpElo);
    }else{
        VarElo = 0;
    }

    socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:100});

    var Resultado;
    if (Turno() == 'White'){
        Resultado = '1-0';
    }else{
        Resultado = '0-1';
    }
    $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">' + Resultado + '</label>');
        
    $('#ResultMessage').text('You have won the game by time. Your new rating is: ' + MyElo + ' (+' + VarElo + ')');
    $('#DialogMessage').dialog('open'); 
}

function DrawByTime(data){

    var VarElo;

    $('#btOfrecerTablas').hide();
    $('#btResign').hide();
    $('#btMain').show();
    ResetBotones();
    
    if (nSound == 1){
        ion.sound.play('draw');
    }
    
    $('#lbResultadoJugador').text('1/2');
    $('#lbResultadoOponente').text('1/2');

    if (Rated == 'Rated'){
        var Dif = MyElo - OpElo;
        var Exig = CalcularExigencia(Dif);
        VarElo = (50 - Exig)/5;
        MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
        MyElo = Math.round(MyElo);
        OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
        OpElo = Math.round(OpElo);
    }else{
        VarElo = 0;
    }

    socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:50});

    $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">1/2-1/2</label>');
        
    $('#ResultMessage').text('The game was draw for insufficient material. Your new rating is: ' + MyElo + ' (+' + VarElo + ')');
    $('#DialogMessage').dialog('open'); 
}

function LostByResign(){

    var VarElo;
    
    socket.emit('LostByResign',{PlayRoom:PlayRoom});
        
    if (MiTurno){
        StopTimer('Abajo');
    }else{
        StopTimer('Arriba');
    }

    $('#btOfrecerTablas').hide();
    $('#btResign').hide();
    $('#btMain').show();
    ResetBotones();
    if (nSound == 1){
        ion.sound.play('lost');
    }
    $('#lbResultadoJugador').text('0');
    $('#lbResultadoOponente').text('1');

    if (Rated == 'Rated'){
        var Dif = MyElo - OpElo;
        var Exig = CalcularExigencia(Dif);
        VarElo = (0 - Exig)/5;
        MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
        MyElo = Math.round(MyElo);
        OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
        OpElo = Math.round(OpElo);
    }else{
        VarElo = 0;
    }

    socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:0});

    var Resultado;
    if (Turno() == 'White'){
        Resultado = '0-1';
    }else{
        Resultado = '1-0';
    }
    socket.emit('UpdateStatusGame',{Resultado:Resultado,GameId:GameId});

    $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">' + Resultado + '</label>');
        
    $('#ResultMessage').text('You have resigned the game. Your new rating is: ' + MyElo + ' (' + VarElo + ')')
    $('#DialogMessage').dialog('open');
}

function WinByResign(data){
    
    var VarElo;
    
    if (MiTurno){
        StopTimer('Abajo');
    }else{
        StopTimer('Arriba');
    }

    $('#btOfrecerTablas').hide();
    $('#btResign').hide();
    $('#btMain').show();
    ResetBotones();
    if (nSound == 1){
        ion.sound.play('win');
    }
    $('#lbResultadoJugador').text('1');
    $('#lbResultadoOponente').text('0');

    if (Rated == 'Rated'){
        var Dif = MyElo - OpElo;
        var Exig = CalcularExigencia(Dif);
        VarElo = (100 - Exig)/5;
        MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
        MyElo = Math.round(MyElo);
        OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
        OpElo = Math.round(OpElo);
    }else{
        VarElo = 0;
    }

    socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:100});

    var Resultado;
    if (Turno() == 'White'){
        Resultado = '0-1';
    }else{
        Resultado = '1-0';
    }
    $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">' + Resultado + '</label>');
        
    $('#ResultMessage').text('You have won the game by resign. Your new rating is: ' + MyElo + ' (+' + VarElo + ')')
    $('#DialogMessage').dialog('open');
}

function DiscPlaying(data){
    
    var VarElo;
    
    if (MiTurno){
        StopTimer('Abajo');
    }else{
        StopTimer('Arriba');
    }

    $('#btOfrecerTablas').hide();
    $('#btResign').hide();
    $('#btMain').show();
    ResetBotones();
    if (nSound == 1){
        ion.sound.play('win');
    }
    $('#lbResultadoJugador').text('1');
    $('#lbResultadoOponente').text('0');

    if (Rated == 'Rated'){
        var Dif = MyElo - OpElo;
        var Exig = CalcularExigencia(Dif);
        VarElo = (100 - Exig)/5;
        MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
        MyElo = Math.round(MyElo);
        OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
        OpElo = Math.round(OpElo);
    }else{
        VarElo = 0;
    }

    socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:100});
    socket.emit('UpdateStatusDesc',{MyName:data.PlayerName,MyElo:OpElo});

    var Resultado;
    if (Turno() == 'White'){
        Resultado = '1-0';
    }else{
        Resultado = '0-1';
    }
    socket.emit('UpdateStatusGame',{Resultado:Resultado,GameId:GameId});
   
    $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">' + Resultado + '</label>');
    
    $('#ResultMessage').text('You have won the game by disconnection. Your new rating is: ' + MyElo + ' (+' + VarElo + ')')
    $('#DialogMessage').dialog('open');
}

function GoToMain(){
    socket.emit('LeaveRoom',{PlayRoom:PlayRoom});
    //socket.emit('RetosActivos',{});

    $('#ContenedorTablero').hide();
    $('#ContenedorRetos').show();

    $('#btMain').hide();
    $('#btCrearReto').show();

    chess.reset();
    board1.position(chess.fen());
    if (IsFliped){
        board1.flip();
        IsFliped = false;
    }
}

function OfrecerTablas(){
    $('#btOfrecerTablas').hide();
    $('#OfrecerTablas').show();
    socket.emit('OfrecerTablas',{PlayRoom:PlayRoom});
    if (nSound == 1){
        ion.sound.play('draw');
    }
}

function OfrecerTablasBack(){
    $('#btOfrecerTablas').hide();
    $('#OfrecerTablas').hide();
    $('#OfrecerTablas2').show();
    OfreciendoTablas = true;
    if (nSound == 1){
        ion.sound.play('draw');
    }
}

function AceptarTablas(){
    
    var VarElo;
    
    $('#OfrecerTablas2').hide();
    $('#btResign').hide();
    $('#btMain').show();
    
    if (MiTurno){
        StopTimer('Abajo');
    }else{
        StopTimer('Arriba');
    }

    $('#lbResultadoJugador').text('1/2');
    $('#lbResultadoOponente').text('1/2');
    if (nSound == 1){
        ion.sound.play('draw');
    }

    if (Rated == 'Rated'){
        var Dif = MyElo - OpElo;
        var Exig = CalcularExigencia(Dif);
        VarElo = (50 - Exig)/5;
        MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
        MyElo = Math.round(MyElo);
        OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
        OpElo = Math.round(OpElo);
    }else{
        VarElo = 0;
    }

    var cVarElo;
    if (VarElo >= 0){
        cVarElo = '+' + VarElo;
    }else{
        cVarElo = VarElo;
    }
        
    socket.emit('AceptarTablas',{PlayRoom:PlayRoom});
    socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:50});
    socket.emit('UpdateStatusGame',{Resultado:'1/2-1/2',GameId:GameId});

    $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">1/2-1/2</label>');
        
    $('#ResultMessage').text('The game was draw by mutual agreement. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
    $('#DialogMessage').dialog('open');    
        
}

function AceptarTablasBack(data){

    var VarElo;
    
    $('#OfrecerTablas').hide();
    //$('#OfrecerTablas2').hide();
    $('#btResign').hide();
    $('#btMain').show();
    
    if (MiTurno){
        StopTimer('Abajo');
    }else{
        StopTimer('Arriba');
    }

    $('#lbResultadoJugador').text('1/2');
    $('#lbResultadoOponente').text('1/2');
    if (nSound == 1){
        ion.sound.play('draw');
    }
    
    if (Rated == 'Rated'){
        var Dif = MyElo - OpElo;
        var Exig = CalcularExigencia(Dif);
        VarElo = (50 - Exig)/5;
        MyElo = (parseFloat(MyElo) + parseFloat(VarElo));
        MyElo = Math.round(MyElo);
        OpElo = (parseFloat(OpElo) - parseFloat(VarElo));
        OpElo = Math.round(OpElo);
    }else{
        VarElo = 0;
    }

    var cVarElo;
    if (VarElo >= 0){
        cVarElo = '+' + VarElo;
    }else{
        cVarElo = VarElo;
    }

    socket.emit('UpdateStatus',{MyName:MyName,Status:'On Line',MyElo:MyElo,Result:50});

    $('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">1/2-1/2</label>');
            
    $('#ResultMessage').text('The game was draw by mutual agreement. Your new rating is: ' + MyElo + ' (' + cVarElo + ')');
    $('#DialogMessage').dialog('open');

}

function DeclinarTablas(){
    $('#OfrecerTablas2').hide();
    socket.emit('DeclinarTablas',{PlayRoom:PlayRoom});
}

function DeclinarTablasBack(){
    $('#OfrecerTablas').hide();
    $('#DeclinarTablas').show();
}

function ResetBotones(){
    $('#OfrecerTablas').hide();
    $('#OfrecerTablas2').hide();
    $('#DeclinarTablas').hide();
}