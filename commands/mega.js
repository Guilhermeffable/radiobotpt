const dis = require('../music/dispatcher')


module.exports.run =  (client, message, args, queue, searcher) => {
    dis.createDispatcher('https://20133.live.streamtheworld.com/MEGA_HITSAAC.aac?dist=triton-widget&tdsdk=js-2.9&pname=tdwidgets&pversion=2.9&banners=none', message)
    
}

module.exports.config = {

    name:"mega",
    aliases: []
}