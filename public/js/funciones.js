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
                  socket.emit('CrearReto',{MyName:MyName,MyElo:MyElo,Color:Color})
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