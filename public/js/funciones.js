function SendMensageGeneralChatBack(data){
    $('#DivGeneralChat').append('<span style="color:black; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">'+ 
                            data.PlayerName + ': ' + '</span>' + 
                            '<span style="color:#d6482a; font-size:16px; font-family:Arial,Helvetica,sans-serif; font-weight:bold">' +
                            data.ChatText + '</span><br>');
    $('#DivGeneralChat').animate({scrollTop:$('#DivGeneralChat').prop('scrollHeight')},500);
}

function IniDialogMessage(){
    $('#DialogMessage').dialog({
        modal: true,
        buttons: {
          Ok: function() {
            $(this).dialog('close');
          }
        }
    });
}
