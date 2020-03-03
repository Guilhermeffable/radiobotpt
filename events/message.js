const play = require('../commands/play')
const volume = require('../commands/volume')

module.exports = (client, message) => {
    const dispatcher = play(client, message)
    if(message.content.startsWith('?play')) {
        
        return dispatcher
    }

}