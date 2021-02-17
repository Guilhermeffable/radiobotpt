const dis = require('../music/dispatcher')


module.exports.run =  (client, message, args, queue, searcher) => {

    dis.createDispatcher('https://mcrwowza7.mcr.iol.pt/cidade/smil:cidade.smil/playlist.m3u8', message)

}

module.exports.config = {

    name:"cid",
    aliases: []
}