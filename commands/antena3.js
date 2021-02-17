const dis = require('../music/dispatcher')


module.exports.run =  (client, message, args, queue, searcher) => {

    dis.createDispatcher('https://streaming-live.rtp.pt/liveradio/antena380a/playlist.m3u8?DVR', message)

}

module.exports.config = {

    name:"antena3",
    aliases: []
}