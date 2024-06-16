var nCoordenadas = 1;
var nHighlight = 1;
var nPromote = 1;
var nSound = 1;
var cWelcome = 'Hello';
var cCountry = 'AD'; 
var cCountryLong = 'Andorra'; 
var WhoPlayer; 

function IniGridGames(){
	jQuery('#GridGames').jqGrid({
		datatype: 'local',
		height: 285,
		width:513,
	   	colNames:['White','Rating','Black','Rating','Status','Timing','Room'],
	   	colModel:[          {name:'White',index:'White',width:150},
                            {name:'RatingWhite',index:'RatingWhite',width:70,align:'center'},	 
                            {name:'Black',index:'Black',width:150},
							{name:'RatingBlack',index:'RatingBlack',width:70,align:'center'},
                            {name:'Status',index:'Status',width:110,align:'center'},
                            {name:'Timing',index:'Timing',width:60,align:'center'},
                            {name:'Room',width:50,hidden:true}
                            ],
		onSelectRow: function(id){
		    var rowData = jQuery(this).getRowData(id); 
            var Room = rowData['Room']; 
			alert(Room)                   
		}
    });
}

function IniGridPlayers(){
	jQuery('#GridPlayers').jqGrid({
		datatype: 'local',
		height: 285,
		width:513,
	   	colNames:['Nick Name','Rating','Country','Title','Status','Games','IdPlayer'],
	   	colModel:[
                            {name:'Name',index:'Name', width:250},
                            {name:'Rating',index:'Rating',width:70,align:'center'},	 
                            {name:'Country',width:24,fixed:true,align:'center',
                                formatter: function(cellvalue, options, rowObject){
                                    var cTitle = rowObject['Title'];
									cellvalue = cellvalue.toLowerCase();
                                    return "<img src='res/img/flags/16/"+cellvalue+".png' title='"+cTitle+"' alt='Country' />";
                                }                             
                            },
                            {name:'Title',width:50,hidden:true},
                            {name:'Status',width:110},
                            {name:'Games',index:'Games',sorttype:'int',width:90,align:'right'},
                            {name:'IdPlayer',width:50,hidden:true}
                            ],
		onSelectRow: function(id){
		    var rowData = jQuery(this).getRowData(id); 
            WhoPlayer = rowData['IdPlayer']; 
			alert(WhoPlayer)                   
		}
    });
}

function LoadPlayersBack(data){
	var Name,Country,Title,Rating,Status,Games,IdPlayer;

	$('#GridPlayers').jqGrid('clearGridData');

	for(var i=0;i<data.Players.length;i++){
		Name = data.Players[i].PlayerName;
		Country = data.Players[i].Flag;
		Title = data.Players[i].CountryLong;
		Rating = data.Players[i].Rating;
		Status = data.Players[i].Status;
		Games = data.Players[i].Games;
		IdPlayer = data.Players[i].SocketId;
		jQuery('#GridPlayers').jqGrid('addRowData',i+1,{ Name:Name , Rating:Rating , Country:Country , Title:Title , Status:Status , Games:Games , IdPlayer:IdPlayer});
    }

	$('#lbPlayersOnLine').text('( '+data.Players.length+' )');
}

function LoadGamesBack(data){
	var WhiteName,WhiteElo,BlackName,BlackElo,Status,Timing,Room;

	$('#GridGames').jqGrid('clearGridData');

	for(var i=0;i<data.GamesData.length;i++){
		WhiteName = data.GamesData[i].whitename;
		WhiteElo = data.GamesData[i].whiteelo;
		BlackName = data.GamesData[i].blackname;
		BlackElo = data.GamesData[i].blackelo;
		Status = data.GamesData[i].status;
		Timing = data.GamesData[i].timing;
		Room = data.GamesData[i].room;
		jQuery('#GridGames').jqGrid('addRowData',i+1,{ White:WhiteName , RatingWhite:WhiteElo , Black:BlackName , RatingBlack:BlackElo , Status:Status , Timing:Timing , Room:Room});
    }	
}

function LoadIniDataBack(data){
	var aPlayerIniData = JSON.parse(data.PlayerIniData);
	
	MyElo = aPlayerIniData[0].Elo;
    $('#DivGeneralChat').append('<span style="color:black; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">'+ 
                            'Sys: ' + '</span>' + 
                            '<span style="color:#d6482a; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">' +
                            'Welcome ' + MyName + '</span><br>');
    $('#DivGeneralChat').animate({scrollTop:$('#DivGeneralChat').prop('scrollHeight')},500);
    $('#DivGeneralChat').append('<span style="color:black; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">'+ 
                            'Sys: ' + '</span>' + 
                            '<span style="color:#d6482a; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">' +
                            'Your initial rating is: ' + MyElo + '</span><br>');
    $('#DivGeneralChat').animate({scrollTop:$('#DivGeneralChat').prop('scrollHeight')},500);
	$('#Minutes').val(aPlayerIniData[0].Minutes);
	$('#Seconds').val(aPlayerIniData[0].Seconds);
	$('#MinRating').val(aPlayerIniData[0].MinElo);
	$('#MaxRating').val(aPlayerIniData[0].MaxElo);
	if (aPlayerIniData[0].Rated == 1){
		$('#SelectRated').val('Rated');
	}else{
		$('#SelectRated').val('UnRated');
	}
	$('#SelectColor').val(aPlayerIniData[0].Color);

	nCoordenadas = aPlayerIniData[0].Coordenadas;
	nHighlight = aPlayerIniData[0].Highlight;
	nPromote = aPlayerIniData[0].Promote;
	nSound = aPlayerIniData[0].Sound;
	cWelcome = aPlayerIniData[0].Welcome;
	cCountry = aPlayerIniData[0].Country; 
	cCountryLong = aPlayerIniData[0].Alt;	

}

function SendMensageGeneralChatBack(data){
    $('#DivGeneralChat').append('<span style="color:black; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">'+ 
                            data.PlayerName + ': ' + '</span>' + 
                            '<span style="color:#d6482a; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">' +
                            data.ChatText + '</span><br>');
    $('#DivGeneralChat').animate({scrollTop:$('#DivGeneralChat').prop('scrollHeight')},500);
}

function SendMensagePrivateChatBack(data){
    $('#DivPrivateChat').append('<span style="color:black; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">'+ 
                            data.PlayerName + ': ' + '</span>' + 
                            '<span style="color:#d6482a; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">' +
                            data.ChatText + '</span><br>');
    $('#DivPrivateChat').animate({scrollTop:$('#DivPrivateChat').prop('scrollHeight')},500);
}

function IniDialogMessage(){
    $('#DialogMessage').dialog({
      autoOpen:false,  
      modal: true,
        buttons: {
          Ok: function() {
            $(this).dialog('close');
          }
        }
    });
}

function IniDialogReconnect(){
    $('#DialogReconnect').dialog({
      autoOpen:false,  
      modal: true,
        buttons: {
          'Reconnect': function() {
            $(this).dialog('close');
			window.location = 'http://localhost:3000/main.html?name='+MyName;
            //window.location = 'https://kaspichessnew-11cf4b4869b9.herokuapp.com/main.html?name='+MyName;
          }
        }
    });
}

function IniDialogStats(){
    $('#DialogStats').dialog({
      autoOpen:false,  
      modal: true,
        buttons: {
          Ok: function() {
            $(this).dialog('close');
          }
        }
    });
}

function ShowStats(data){
	$('#DialogStats').dialog('open');
	// No encuentra jugador
	if (data.Error){
		$('#ResultMessageStats').text('No stats for this player.');
	}else{
		$('#ResultMessageStats').text('Stats for this player.');
		$('#StatsGames').text(data.Games);
		$('#StatsWins').text(data.Wins);
		$('#StatsLosts').text(data.Losts);
		$('#StatsDraws').text(data.Draws);
	}
}

function IniDialogNewGame(){

  $('#DialogNewGame').dialog({
    autoOpen:false,
    height:554,
    width:550,			
    modal: true,
    buttons: {
            'Create new game': function() {
                if (CreateNewGame()){
                  var Color = $('#SelectColor').val();                  
                  var Minutes = $('#Minutes').val();
                  var Seconds = $('#Seconds').val();
                  var Rated = $('#SelectRated').val();
                  var Min = $('#MinRating').val();
                  var Max = $('#MaxRating').val();
                  socket.emit('CrearReto',{MyName:MyName,MyElo:MyElo,Color:Color,Minutes:Minutes,Seconds:Seconds,Rated:Rated,Min:Min,Max:Max})
                  $('#btCancelarReto').show();
                  $('#btCrearReto').hide();
                  $(this).dialog('close');
				  $('#Message2').text('');
                }                          
            }, 
            Cancel: function() {
                $(this).dialog('close');
				$('#Message2').text('');
            },
			'Save': function() {
				var Rated;
				if ($('#SelectRated').val() == 'Rated'){
					Rated = 1;
				}else{
					Rated = 0;
				}
				if (CreateNewGame()){
					socket.emit('SaveGameSetting',{PlayerName:MyName,Color:$('#SelectColor').val(),Minutes:$('#Minutes').val(),Seconds:$('#Seconds').val(),Rated:Rated,Min:$('#MinRating').val(),Max:$('#MaxRating').val()})
					$(this).dialog('close');
					$('#Message2').text('');
				}
			}
    }
  });

}

function IniDialogSetting(){

	$('#DialogSetting').dialog({
	  autoOpen:false,
	  height:574,
	  width:450,			
	  modal: true,
	  buttons: {
			  'Save': function() {
				 	SaveSetting();
					$(this).dialog('close');                          
			  }, 
			  Cancel: function() {
				 	$(this).dialog('close');
			  }
	  }
	});
  
}

function LoadSettingBack(data){
	
	if (data.Coordenadas == 1){
		$('#cbShowCoord').prop('checked',true);
	}else{
		$('#cbShowCoord').prop('checked',false);
	} 
	if (data.Highlight == 1){
		$('#cbHighLight').prop('checked',true);
	}else{
		$('#cbHighLight').prop('checked',false);
	} 
	if (data.Promote == 1){
		$('#cbPromote').prop('checked',true);
	}else{
		$('#cbPromote').prop('checked',false);
	}
	if (data.Sound == 1){
		$('#cbSound').prop('checked',true);
	}else{
		$('#cbSound').prop('checked',false);
	}
	$('#welcome').val(data.Welcome);
	$("#country").val(data.Country);

    $('#DialogSetting').dialog('open');
}

function SaveSetting(){
		
	if ($('#cbShowCoord').is(':checked')){
		nCoordenadas = 1;
	}else{
		nCoordenadas = 0;
	}
	if ($('#cbHighLight').is(':checked')){
		nHighlight = 1;		
	}else{
		nHighlight = 0;		
	}
	if ($('#cbPromote').is(':checked')){
		nPromote = 1;
	}else{
		nPromote = 0;
	}
	if ($('#cbSound').is(':checked')){
		nSound = 1;
	}else{
		nSound = 0;
	}
	cWelcome = $('#welcome').val();
	cCountry = $('#country').val();
	cCountryLong = $('#country option:selected').text();

	socket.emit('SaveSetting',{PlayerName:MyName,Coordenadas:nCoordenadas,Highlight:nHighlight,Promote:nPromote,Sound:nSound,Welcome:cWelcome,Country:cCountry,CountryLong:cCountryLong});               

	var config;
    if (nCoordenadas == 1){
        config = {position:chess.fen(),draggable:true,onDrop:onDrop,onSnapEnd:onSnapEnd,onMoveEnd:onMoveEnd,showNotation:true};
    }else{
        config = {position:chess.fen(),draggable:true,onDrop:onDrop,onSnapEnd:onSnapEnd,onMoveEnd:onMoveEnd,showNotation:false};
    }               
    board1 = ChessBoard('board1',config);
	if (IsFliped){
		board1.flip();
	}
	
}

function numberOnly(id) {
  var element = document.getElementById(id);
  element.value = element.value.replace(/[^0-9]/gi,"");
}

function CreateNewGame(){
  var Result = true;

  if ($('#Minutes').val() == ''){
    $('#Message2').text('The field Minutes is empty.');
    $('#Message2').css({'background-color':'yellow'});
    return false;
  }

  if ($('#Seconds').val() == ''){
    $('#Message2').text('The field Seconds is empty.');
    $('#Message2').css({'background-color':'yellow'});
    return false;
  }

  if ($('#MinRating').val() == ''){
    $('#Message2').text('The field Min Rating is empty.');
    $('#Message2').css({'background-color':'yellow'});
    return false;
  }

  if ($('#MaxRating').val() == ''){
    $('#Message2').text('The field Max Rating is empty.');
    $('#Message2').css({'background-color':'yellow'});
    return false;
  }

  if ($('#MinRating').val() > $('#MaxRating').val()){
    $('#Message2').text('The field Min Rating is too high.');
    $('#Message2').css({'background-color':'yellow'});
    return false;
  }

  return Result;
}

function CalcularExigencia(nDif){
	
	var nExig;
	
	if (nDif>=0 && nDif<=3){
		nExig = 50;
	}else if (nDif>=4 && nDif<=10){
		nExig = 51;
	}else if (nDif>=11 && nDif<=17){
		nExig = 52;
	}else if (nDif>=18 && nDif<=25){
		nExig = 53;
	}else if (nDif>=26 && nDif<=32){
		nExig = 54;
	}else if (nDif>=33 && nDif<=39){
		nExig = 55;
	}else if (nDif>=40 && nDif<=46){
		nExig = 56;
	}else if (nDif>=47 && nDif<=53){
		nExig = 57;
	}else if (nDif>=54 && nDif<=61){
		nExig = 58;
	}else if (nDif>=62 && nDif<=68){
		nExig = 59;
	}else if (nDif>=69 && nDif<=76){
		nExig = 60;
	}else if (nDif>=77 && nDif<=83){
		nExig = 61;
	}else if (nDif>=84 && nDif<=91){
		nExig = 62;
	}else if (nDif>=92 && nDif<=98){
		nExig = 63;
	}else if (nDif>=99 && nDif<=106){
		nExig = 64;
	}else if (nDif>=107 && nDif<=113){
		nExig = 65;
	}else if (nDif>=114 && nDif<=121){
		nExig = 66;
	}else if (nDif>=122 && nDif<=129){
		nExig = 67;
	}else if (nDif>=130 && nDif<=137){
		nExig = 68;
	}else if (nDif>=138 && nDif<=145){
		nExig = 69;
	}else if (nDif>=146 && nDif<=153){
		nExig = 70;
	}else if (nDif>=154 && nDif<=162){
		nExig = 71;
	}else if (nDif>=163 && nDif<=170){
		nExig = 72;
	}else if (nDif>=171 && nDif<=179){
		nExig = 73;
	}else if (nDif>=180 && nDif<=188){
		nExig = 74;
	}else if (nDif>=189&& nDif<=197){
		nExig = 75;
	}else if (nDif>=198 && nDif<=206){
		nExig = 76;
	}else if (nDif>=207 && nDif<=215){
		nExig = 77;
	}else if (nDif>=216 && nDif<=225){
		nExig = 78;
	}else if (nDif>=226 && nDif<=235){
		nExig = 79;
	}else if (nDif>=236 && nDif<=245){
		nExig = 80;
	}else if (nDif>=246 && nDif<=256){
		nExig = 81;
	}else if (nDif>=257 && nDif<=267){
		nExig = 82;
	}else if (nDif>=268 && nDif<=278){
		nExig = 83;
	}else if (nDif>=279 && nDif<=290){
		nExig = 84;
	}else if (nDif>=291 && nDif<=302){
		nExig = 85;
	}else if (nDif>=303 && nDif<=315){
		nExig = 86;
	}else if (nDif>=316 && nDif<=328){
		nExig = 87;
	}else if (nDif>=329 && nDif<=344){
		nExig = 88;
	}else if (nDif>=345 && nDif<=357){
		nExig = 89;
	}else if (nDif>=358 && nDif<=374){
		nExig = 90;
	}else if (nDif>=375 && nDif<=391){
		nExig = 91;
	}else if (nDif>=392 && nDif<=411){
		nExig = 92;
	}else if (nDif>=412 && nDif<=432){
		nExig = 93;
	}else if (nDif>=433 && nDif<=456){
		nExig = 94;
	}else if (nDif>=457 && nDif<=484){
		nExig = 95;
	}else if (nDif>=485 && nDif<=517){
		nExig = 96;
	}else if (nDif>=518 && nDif<=559){
		nExig = 97;
	}else if (nDif>=560 && nDif<=619){
		nExig = 98;
	}else if (nDif>=620 && nDif<=734){
		nExig = 99;
	}else if (nDif>=735){
		nExig = 100;
	}else if (nDif<=0 && nDif>=-3){
		nExig = 50;
	}else if (nDif<=-4 && nDif>=-10){
		nExig = 49;
	}else if (nDif<=-11 && nDif>=-17){
		nExig = 48;
	}else if (nDif<=-18 && nDif>=-25){
		nExig = 47;
	}else if (nDif<=-26 && nDif>=-32){
		nExig = 46;
	}else if (nDif<=-33 && nDif>=-39){
		nExig = 45;
	}else if (nDif<=-40 && nDif>=-46){
		nExig = 44;
	}else if (nDif<=-47 && nDif>=-53){
		nExig = 43;
	}else if (nDif<=-54 && nDif>=-61){
		nExig = 42;
	}else if (nDif<=-62 && nDif>=-68){
		nExig = 41;
	}else if (nDif<=-69 && nDif>=-76){
		nExig = 40;
	}else if (nDif<=-77 && nDif>=-83){
		nExig = 39;
	}else if (nDif<=-84 && nDif>=-91){
		nExig = 38;
	}else if (nDif<=-92 && nDif>=-98){
		nExig = 37;
	}else if (nDif<=-99 && nDif>=-106){
		nExig = 36 ;
	}else if (nDif<=-107 && nDif>=-113){
		nExig = 35;
	}else if (nDif<=-114 && nDif>=-121){
		nExig = 34;
	}else if (nDif<=-122 && nDif>=-129){
		nExig = 33;
	}else if (nDif<=-130 && nDif>=-137){
		nExig = 32;
	}else if (nDif<=-138 && nDif>=-145){
		nExig = 31;
	}else if (nDif<=-146 && nDif>=-153){
		nExig = 30;
	}else if (nDif<=-154 && nDif>=-162){
		nExig = 29;
	}else if (nDif<=-163 && nDif>=-170){
		nExig = 28;
	}else if (nDif<=-171 && nDif>=-179){
		nExig = 27;
	}else if (nDif<=-180 && nDif>=-188){
		nExig = 26;
	}else if (nDif<=-189 && nDif>=-197){
		nExig = 25;
	}else if (nDif<=-198 && nDif>=-206){
		nExig = 24;
	}else if (nDif<=-207 && nDif>=-215){
		nExig = 23;
	}else if (nDif<=-216 && nDif>=-225){
		nExig = 22;
	}else if (nDif<=-226 && nDif>=-235){
		nExig = 21;
	}else if (nDif<=-236 && nDif>=-245){
		nExig = 20;
	}else if (nDif<=-246 && nDif>=-256){
		nExig = 19;
	}else if (nDif<=-257 && nDif>=-267){
		nExig = 18;
	}else if (nDif<=-268 && nDif>=-278){
		nExig = 17;
	}else if (nDif<=-279 && nDif>=-290){
		nExig = 16;
	}else if (nDif<=-291 && nDif>=-302){
		nExig = 15;
	}else if (nDif<=-303 && nDif>=-315){
		nExig = 14;
	}else if (nDif<=-316 && nDif>=-328){
		nExig = 13;
	}else if (nDif<=-329 && nDif>=-344){
		nExig = 12;
	}else if (nDif<=-345 && nDif>=-357){
		nExig = 11;
	}else if (nDif<=-358 && nDif>=-374){
		nExig = 10;
	}else if (nDif<=-375 && nDif>=-391){
		nExig = 9;
	}else if (nDif<=-392 && nDif>=-411){
		nExig = 8;
	}else if (nDif<=-412 && nDif>=-432){
		nExig = 7;
	}else if (nDif<=-433 && nDif>=-456){
		nExig = 6;
	}else if (nDif<=-457 && nDif>=-484){
		nExig = 5;
	}else if (nDif<=-485 && nDif>=-517){
		nExig = 4;
	}else if (nDif<=-518 && nDif>=-559){
		nExig = 3;
	}else if (nDif<=-560 && nDif>=-619){
		nExig = 2;
	}else if (nDif<=-620 && nDif>=-734){
		nExig = 1;
	}else if (nDif<=-735){
		nExig = 0;
	}	
	
	return nExig;
	
}

function Turno(){
	var cString = chess.fen();
	var aArray = cString.split(' ');
	if (aArray[1] == 'w'){
		return 'Black';
	}else{
		return 'White';
	}
}

function TurnoReal(){
	var cString = chess.fen();
	var aArray = cString.split(' ');
	if (aArray[1] == 'w'){
		return 'White';
	}else{
		return 'Black';
	}
}

function KingAlone(Turno){
	
	// Comprobar si rey solo en caida de bandera
	var cCadenaFen = chess.fen();
	var aArray = cCadenaFen.split(' ');
	var cSubCadena = aArray[0];
	var i;
	var cChar;

	if (Turno == 'White'){
		
		for ( i = 0; i < cSubCadena.length; i++){
			cChar = cSubCadena.substring(i,i+1);
						
			if (cChar == 'P'){
				return false;
			}else if (cChar == 'R'){
				return false;
			}else if (cChar == 'N'){
				return false;
			}else if (cChar == 'B'){
				return false;
			}else if (cChar == 'Q'){
				return false;
			}
			
		}
		
	}else{

		for ( i = 0; i < cSubCadena.length; i++){
			cChar = cSubCadena.substring(i,i+1);
						
			if (cChar == 'p'){
				return false;
			}else if (cChar == 'r'){
				return false;
			}else if (cChar == 'n'){
				return false;
			}else if (cChar == 'b'){
				return false;
			}else if (cChar == 'q'){
				return false;
			}
			
		}

	}

	return true;
	
}

function DrawGame(){
	var nContMoves;
	var aMove = chess.history();
	var LastMove = aMove[aMove.length-1];
	if (Turno() == 'White'){
		nContMoves = (aMove.length + 1)/2;
		LastMove = nContMoves + '.' + LastMove;
	}
	$('#DivGame').append('<label style="margin-left:4px; margin-top:4px; color:black; float:left; font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:18px;">' + LastMove + '</label>');
}