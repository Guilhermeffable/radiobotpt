const volume = require('../music/volume');

module.exports.run =  (client, message, args, queue, searcher) => {

    const vol = message.content.split(' ')[1]/100

    volume.vol(message, dispatcher, vol)

}

module.exports.config = {

    name:"vol",
    aliases: []
}