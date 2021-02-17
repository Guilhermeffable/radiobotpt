let play = (guild, song, queue) => {

    const serverQueue = queue.get(guild.id);

    if(!song){

        setInterval(serverQueue.vChannel.leave(), 300000);
        queue.delete(guild.id);
        return;

    }

    serverQueue.duration = song.duration;

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on('finish', () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })


};

module.exports.play = play;