
function vol(message, dispatcher, vol){

    if( vol < 0.0){

        message.channel.send("Volume inválido. Insere um número de 0 a 10.")
    
    }
    else{
    
        dispatcher.setVolume(vol)
    
    }

}

module.exports.vol = vol;