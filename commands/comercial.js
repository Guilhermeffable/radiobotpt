const dis = require('../music/dispatcher')


module.exports.run =  (client, message, args, queue, searcher) => {

    dis.createDispatcher('http://mcrwowza7.mcr.iol.pt/comercial/smil:comercial.smil/playlist.m3u8', message)

}

module.exports.config = {

    name:"",
    aliases: []
}