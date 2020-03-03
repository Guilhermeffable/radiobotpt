module.exports = (message,dispatcher) => {

    console.log(message.content)
    const volume = message.content.split(' ')[1]/100
    console.log(volume)
    if(0.0 < volume < 1.0){
        dispatcher.setVolume(volume)
    }
    else{
        return message.channel.send('Volume inválido.')
    }
    

}