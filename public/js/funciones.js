function SendMensageGeneralChatBack(data){
    $('#DivGeneralChat').append('<span style="color:black; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">'+ 
                            data.PlayerName + ': ' + '</span>' + 
                            '<span style="color:#d6482a; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">' +
                            data.ChatText + '</span><br>');
    $('#DivGeneralChat').animate({scrollTop:$('#DivGeneralChat').prop('scrollHeight')},500);
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
                  //alert(Color) Ok
                  var Minutes = $('#Minutes').val();
                  var Seconds = $('#Seconds').val();
                  var Rated = $('#SelectRated').val();
                  var Min = $('#MinRating').val();
                  var Max = $('#MaxRating').val();
                  socket.emit('CrearReto',{MyName:MyName,MyElo:MyElo,Color:Color,Minutes:Minutes,Seconds:Seconds,Rated:Rated,Min:Min,Max:Max})
                  $('#btCancelarReto').show();
                  $('#btCrearReto').hide();
                  $(this).dialog('close');
                }                          
            }, 
            Cancel: function() {
                $(this).dialog('close');
            }
    }
  });

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
