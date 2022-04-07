const dis = require('../music/dispatcher');

const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args, queue, searcher) => {
	dis.createDispatcher(
		'https://streaming-live.rtp.pt/liveradio/antena380a/playlist.m3u8?DVR',
		message
	);

	let msg = new MessageEmbed()
		.setTitle('Rádio ')
		.setDescription(`Antena3`)
		.setColor('ORANGE');

	message.channel.send({ embeds: [msg] });
};

module.exports.config = {
	name: 'antena3',
	aliases: [],
};
