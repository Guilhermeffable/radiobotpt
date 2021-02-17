const dis = require('../music/dispatcher')


module.exports.run =  (client, message, args, queue, searcher) => {

    dis.createDispatcher('https://mcrwowza7.mcr.iol.pt/cidhiphop/cidhiphop.stream/playlist.m3u8', message)
}

module.exports.config = {

    name:"cidhip",
    aliases: []
}