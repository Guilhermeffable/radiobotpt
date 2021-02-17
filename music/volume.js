
function vol(message, dispatcher, vol){

    if( vol < 0.0 || vol === undefined || vol === '' || vol === null || isNaN(vol)){

        message.channel.send("Volume inválido. Insere um número de 0 a 10.")
        console.log
    }
    else{
    
        dispatcher.volume(vol)
    
    }

}

module.exports.vol = vol;