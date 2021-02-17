const dis = require('../music/dispatcher')


module.exports.run =  (client, message, args, queue, searcher) => {

    dis.createDispatcher('http://centova.radios.pt:8401/stream.mp3/1', message)

}



module.exports.config = {

    name:"orbital",
    aliases: []
}