const dis = require('../music/dispatcher')


module.exports.run =  (client, message, args, queue, searcher) => {

    dis.createDispatcher('https://centova.radio.com.pt/proxy/500?mp=/stream', message)

}

module.exports.config = {

    name:"hiper",
    aliases: []
}